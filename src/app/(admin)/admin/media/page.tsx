"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatFileSize } from "@/lib/utils";
import { Upload, Search, Trash2, Image as ImageIcon, File, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type MediaFile = {
  name: string;
  path: string;
  url: string;
  size: number;
  createdAt: string | null;
  updatedAt: string | null;
  type: string;
};

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const getIcon = (type: string) => (type.startsWith("image/") ? ImageIcon : File);

export default function AdminMediaPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyPath, setBusyPath] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/upload", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch media files");
      }
      const data = (await res.json()) as MediaFile[];
      setFiles(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load media files. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const filteredFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return files;
    return files.filter((file) => file.name.toLowerCase().includes(term));
  }, [files, query]);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Only PNG, JPG, and WebP images are supported.");
      return false;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Please choose an image smaller than 5 MB.");
      return false;
    }
    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    try {
      setIsUploading(true);
      const compressed = await imageCompression(file, {
        maxSizeMB: MAX_FILE_BYTES / (1024 * 1024),
        maxWidthOrHeight: 3000,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      toast.success("Image uploaded");
      await loadFiles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!window.confirm("Delete this file from storage?")) {
      return;
    }

    try {
      setBusyPath(file.path);
      const res = await fetch(`/api/upload?path=${encodeURIComponent(file.path)}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete file");
      }
      setFiles((prev) => prev.filter((item) => item.path !== file.path));
      toast.success("File deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
      await loadFiles();
    } finally {
      setBusyPath(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media library</h1>
          <p className="text-muted-foreground">
            Assets that power the public case studies and admin snapshots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={Array.from(ALLOWED_TYPES).join(",")}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFileUpload(file);
              }
            }}
          />
          <Button variant="outline" onClick={loadFiles} disabled={isLoading}>
            Refresh
          </Button>
          <Button className="bg-gradient-primary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search files..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Only PNG, JPG, and WebP images under 5 MB can be uploaded. Files are stored in the Supabase <Badge variant="secondary">media</Badge> bucket.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading media...</div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-destructive">{error}</div>
            ) : filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No files found</p>
                <p className="text-muted-foreground">Upload new assets or adjust your search query.</p>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const Icon = getIcon(file.type);
                return (
                  <Card key={file.path} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center relative group">
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 320px"
                            className="object-cover"
                          />
                        ) : (
                          <Icon className="h-16 w-16 text-muted-foreground" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => window.open(file.url, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleDelete(file)}
                            disabled={busyPath === file.path}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="font-medium text-sm truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>
                            {file.createdAt
                              ? new Date(file.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
