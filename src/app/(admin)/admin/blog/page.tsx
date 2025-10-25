"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { BlogPostRecord } from "@/services/blog";
import { personalInfo } from "@/config/site";
import { extractStoragePath } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_DIMENSION = 2000;

const emptyPost = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  tags: "",
  content: "",
  image: "",
  imagePath: "",
  date: new Date().toISOString().split("T")[0],
  readTime: "5 min read",
};

type FormState = typeof emptyPost;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const buildTableOfContents = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("##"))
    .map((line) => {
      const title = line.replace(/^#+\s*/, "");
      const id = slugify(title);
      return { title, id };
    });

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyPost);
  const [error, setError] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [initialImagePath, setInitialImagePath] = useState<string>("");

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blog", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data = (await res.json()) as BlogPostRecord[];
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(
    () => () => {
      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }
    },
    [pendingImagePreview],
  );

  const resetForm = () => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setRemoveExistingImage(false);
    setInitialImagePath("");
    setEditingPost(null);
    setFormData(emptyPost);
  };

  const handleEdit = (post: BlogPostRecord) => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setRemoveExistingImage(false);

    const existingPath = post.imagePath ?? extractStoragePath(post.image ?? "") ?? "";
    setInitialImagePath(existingPath);

    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      category: post.category ?? "",
      tags: post.tags.join(", "),
      content: post.content ?? "",
      image: post.image ?? "",
      imagePath: existingPath,
      date: post.date ?? new Date().toISOString().split("T")[0],
      readTime: post.readTime ?? "5 min read",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Delete failed");
      }
      const target = posts.find((post) => post.id === id);
      if (target?.image) {
        const path = extractStoragePath(target.image);
        if (path) {
          await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: "DELETE" }).catch(() => {
            // Let the user clean this up manually later if the removal fails.
          });
        }
      }
      toast.success("Post deleted");
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Only PNG, JPG, and WebP images are supported.");
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Please choose an image smaller than 5 MB.");
      return;
    }

    try {
      setIsPreparingImage(true);
      const compressed = await imageCompression(file, {
        maxSizeMB: MAX_UPLOAD_BYTES / (1024 * 1024),
        maxWidthOrHeight: MAX_IMAGE_DIMENSION,
        useWebWorker: true,
      });

      const compressedFile =
        compressed instanceof File ? compressed : new File([compressed], file.name, { type: file.type });

      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }

      const previewUrl = URL.createObjectURL(compressedFile);

      setPendingImageFile(compressedFile);
      setPendingImagePreview(previewUrl);
      setRemoveExistingImage(false);
      setFormData((prev) => ({
        ...prev,
        image: previewUrl,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare image");
    } finally {
      setIsPreparingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setRemoveExistingImage(Boolean(formData.imagePath || initialImagePath));
    setFormData((prev) => ({ ...prev, image: "", imagePath: "" }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      if (!formData.title.trim()) {
        toast.error("A title is required.");
        return;
      }
      if (!formData.content.trim()) {
        toast.error("Write some content before publishing.");
        return;
      }

      const computedSlugSource = formData.slug.trim() || formData.title;
      const computedSlug = slugify(computedSlugSource);
      if (!computedSlug) {
        toast.error("Slug cannot be empty.");
        return;
      }

      const slugInUse = posts.some((post) => post.slug === computedSlug && post.id !== editingPost?.id);
      if (slugInUse) {
        toast.error("This slug is already in use. Choose another one.");
        return;
      }

      const tagsArray = Array.from(
        new Set(
          formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      );
      const tableOfContents = buildTableOfContents(formData.content);
      setFormData((prev) => ({ ...prev, slug: computedSlug }));

      let imagePathToSave = formData.imagePath || null;
      let previousPathToDelete: string | null = null;

      if (pendingImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", pendingImageFile);
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (!uploadResponse.ok) {
          const details = (await uploadResponse.json().catch(() => null)) as { message?: string } | null;
          throw new Error(details?.message ?? "Image upload failed");
        }
        const { path } = (await uploadResponse.json()) as { path: string };
        imagePathToSave = path;
        if (initialImagePath && initialImagePath !== path) {
          previousPathToDelete = initialImagePath;
        }
      } else if (removeExistingImage) {
        if (initialImagePath) {
          previousPathToDelete = initialImagePath;
        }
        imagePathToSave = null;
      }

      const excerpt = formData.excerpt.trim() || null;
      const category = formData.category.trim() || null;
      const readTime = formData.readTime.trim() || null;
      const date = formData.date || null;
      const payload = {
        slug: computedSlug,
        title: formData.title,
        excerpt,
        category,
        tags: tagsArray,
        image: imagePathToSave,
        date,
        readTime,
        views: editingPost?.views ?? 0,
        author: {
          name: personalInfo.name,
          role: personalInfo.primaryTitle,
        },
        tableOfContents,
        content: formData.content,
      };

      const method = editingPost ? "PUT" : "POST";
      const body = editingPost ? { id: editingPost.id, ...payload } : payload;

      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Failed to save post");
      }

      if (previousPathToDelete) {
        await fetch(`/api/upload?path=${encodeURIComponent(previousPathToDelete)}`, { method: "DELETE" }).catch(() => {
          // Non-critical cleanup failure.
        });
      }
      setInitialImagePath(imagePathToSave ?? "");
      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }
      setPendingImageFile(null);
      setPendingImagePreview(null);
      setRemoveExistingImage(false);

      toast.success(editingPost ? "Post updated" : "Post created");
      setIsDialogOpen(false);
      resetForm();
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const totalViews = useMemo(() => posts.reduce((sum, post) => sum + post.views, 0), [posts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog management</h1>
          <p className="text-muted-foreground">
            Draft and track essays, playbooks, and case-study updates.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit post" : "Add new post"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(event) => setFormData((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
                    placeholder="auto-generated if blank"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </div>
                <div>
                  <Label>Read time</Label>
                  <Input
                    value={formData.readTime}
                    onChange={(event) => setFormData((prev) => ({ ...prev, readTime: event.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(event) => setFormData((prev) => ({ ...prev, excerpt: event.target.value }))}
                />
              </div>

              <div>
                <Label>Content</Label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                    placeholder="Design ops, Product design..."
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(event) => setFormData((prev) => ({ ...prev, tags: event.target.value }))}
                    placeholder="Design systems, Knowledge ops"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover image</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  {isPreparingImage && <span className="text-sm text-muted-foreground">Processing image...</span>}
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WebP only. Maximum size 5 MB.</p>
                {pendingImageFile && (
                  <p className="text-xs text-muted-foreground">Image will upload when you publish the post.</p>
                )}
                {formData.image && (
                  <div className="rounded-lg border border-dashed border-muted-foreground/40 p-3 space-y-3">
                    <div className="relative mx-auto h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={formData.image}
                        alt="Cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate pr-2">
                        {pendingImageFile?.name ?? formData.imagePath ?? extractStoragePath(formData.image) ?? "Pending image"}
                      </span>
                      <Button variant="outline" size="sm" onClick={handleRemoveImage} disabled={isPreparingImage || isSaving}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleSubmit} className="w-full bg-gradient-primary" disabled={isSaving}>
                {isSaving ? "Saving…" : editingPost ? "Update post" : "Create post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell>{post.category ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{post.date ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total posts</p>
            <p className="text-2xl font-bold">{posts.length}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Combined readership</p>
            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




