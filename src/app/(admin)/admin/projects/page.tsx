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
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ProjectRecord } from "@/services/projects";
import { extractStoragePath } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;

const emptyProject = {
  slug: "",
  title: "",
  description: "",
  category: "",
  technologies: "",
  year: "",
  image: "",
  imagePath: "",
  link: "",
};

type FormState = typeof emptyProject;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyProject);
  const [error, setError] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [initialImagePath, setInitialImagePath] = useState<string>("");

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = (await res.json()) as ProjectRecord[];
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
    setEditingProject(null);
    setFormData(emptyProject);
  };

  const handleEdit = (project: ProjectRecord) => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setRemoveExistingImage(false);

    const existingPath = project.imagePath ?? extractStoragePath(project.image ?? "") ?? "";
    setInitialImagePath(existingPath);

    setEditingProject(project);
    setFormData({
      slug: project.slug ?? "",
      title: project.title,
      description: project.description ?? "",
      category: project.category ?? "",
      technologies: project.technologies.join(", "),
      year: project.year ?? "",
      image: project.image ?? "",
      imagePath: existingPath,
      link: project.link ?? "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project permanently?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Delete failed");
      }
      const target = projects.find((project) => project.id === id);
      if (target?.image) {
        const path = extractStoragePath(target.image);
        if (path) {
          await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: "DELETE" }).catch(() => {
            // Ignore failure; file can be cleaned up later.
          });
        }
      }
      toast.success("Project deleted");
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete project");
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
      setFormData((prev) => ({ ...prev, image: previewUrl }));
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
      const title = formData.title.trim();
      if (!title) {
        toast.error("A title is required.");
        return;
      }

      const computedSlugSource = (formData.slug || formData.title).trim();
      const computedSlug = slugify(computedSlugSource);
      if (!computedSlug) {
        toast.error("Slug cannot be empty.");
        return;
      }

      const slugInUse = projects.some(
        (project) => project.slug === computedSlug && project.id !== editingProject?.id,
      );
      if (slugInUse) {
        toast.error("This slug is already in use. Choose another.");
        return;
      }

      const technologiesArray = Array.from(
        new Set(
          formData.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
        ),
      );

      const description = formData.description.trim();
      const category = formData.category.trim();
      const year = formData.year.trim();
      const link = formData.link.trim();

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

      const payload = {
        slug: computedSlug,
        title,
        description: description || null,
        category: category || null,
        technologies: technologiesArray,
        year: year || null,
        image: imagePathToSave,
        link: link || null,
      };

      const method = editingProject ? "PUT" : "POST";
      const body = editingProject ? { id: editingProject.id, ...payload } : payload;

      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Failed to save project");
      }

      toast.success(editingProject ? "Project updated" : "Project created");
      if (previousPathToDelete) {
        await fetch(`/api/upload?path=${encodeURIComponent(previousPathToDelete)}`, { method: "DELETE" }).catch(() => {
          // Ignore clean-up failure; stale assets can be removed manually.
        });
      }
      setInitialImagePath(imagePathToSave ?? "");
      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }
      setPendingImageFile(null);
      setPendingImagePreview(null);
      setRemoveExistingImage(false);
      setIsDialogOpen(false);
      resetForm();
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        projects
          .map((project) => project.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );
    return ["All", ...values];
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects management</h1>
          <p className="text-muted-foreground">Keep the public portfolio up to date.</p>
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
              Add project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit project" : "Add new project"}</DialogTitle>
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

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={formData.year}
                    onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={formData.technologies}
                  onChange={(event) => setFormData((prev) => ({ ...prev, technologies: event.target.value }))}
                  placeholder="Next.js, Supabase, Tailwind"
                />
              </div>

              <div>
                <Label>External link</Label>
                <Input
                  value={formData.link}
                  onChange={(event) => setFormData((prev) => ({ ...prev, link: event.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Screenshot</Label>
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
                  <p className="text-xs text-muted-foreground">Image will upload when you save the project.</p>
                )}
                {formData.image && (
                  <div className="rounded-lg border border-dashed border-muted-foreground/40 p-3 space-y-3">
                    <div className="relative mx-auto h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={formData.image}
                        alt="Project"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate pr-2">
                        {pendingImageFile?.name ??
                          formData.imagePath ??
                          extractStoragePath(formData.image) ??
                          "Pending image"}
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
                {isSaving ? "Saving..." : editingProject ? "Update project" : "Create project"}
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
                <TableHead>Technologies</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium max-w-xs truncate">{project.title}</TableCell>
                    <TableCell>{project.category ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{project.year ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
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
            <p className="text-sm text-muted-foreground">Total projects</p>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold">{Math.max(categories.length - 1, 0)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
