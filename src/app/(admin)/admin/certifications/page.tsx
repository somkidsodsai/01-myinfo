"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { CertificationRecord } from "@/services/certifications";
import { certificationGroupLabels } from "@/config/site";
import { extractStoragePath } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;

const emptyCertification = {
  name: "",
  organization: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  verificationUrl: "",
  image: "",
  imagePath: "",
  category: "",
  status: "Active",
  group: "global",
};

type FormState = typeof emptyCertification;

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [editingCertification, setEditingCertification] = useState<CertificationRecord | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyCertification);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [initialImagePath, setInitialImagePath] = useState<string>("");

  const loadCertifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/certifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch certifications");
      const data = (await res.json()) as CertificationRecord[];
      setCertifications(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load certifications. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

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
    setEditingCertification(null);
    setFormData(emptyCertification);
  };

  const handleEdit = (cert: CertificationRecord) => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setRemoveExistingImage(false);

    const existingPath = extractStoragePath(cert.image ?? "") ?? "";
    setInitialImagePath(existingPath);

    setEditingCertification(cert);
    setFormData({
      name: cert.name,
      organization: cert.organization ?? "",
      issueDate: cert.issueDate ?? "",
      expiryDate: cert.expiryDate ?? "",
      credentialId: cert.credentialId ?? "",
      verificationUrl: cert.verificationUrl ?? "",
      image: cert.image ?? "",
      imagePath: existingPath,
      category: cert.category ?? "",
      status: cert.status ?? "Active",
      group: cert.group ?? "global",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this certification permanently?")) return;
    try {
      const res = await fetch(`/api/certifications?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Delete failed");
      }
      const target = certifications.find((cert) => cert.id === id);
      if (target?.image) {
        const path = extractStoragePath(target.image);
        if (path) {
          await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: "DELETE" }).catch(() => {
            // Ignore failure; asset can be removed manually later.
          });
        }
      }
      toast.success("Certification deleted");
      loadCertifications();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete certification");
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
      const name = formData.name.trim();
      if (!name) {
        toast.error("Certification name is required.");
        return;
      }

      const organization = formData.organization.trim();
      const credentialId = formData.credentialId.trim();
      const verificationUrl = formData.verificationUrl.trim();
      const category = formData.category.trim();
      const status = formData.status.trim() || "Active";

      setFormData((prev) => ({
        ...prev,
        name,
        organization,
        credentialId,
        verificationUrl,
        category,
        status,
      }));

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
        name,
        organization: organization || null,
        issueDate: formData.issueDate || null,
        expiryDate: formData.expiryDate || null,
        credentialId: credentialId || null,
        verificationUrl: verificationUrl || null,
        image: imagePathToSave,
        category: category || null,
        status,
        group: formData.group || "other",
      };

      const method = editingCertification ? "PUT" : "POST";
      const body = editingCertification ? { id: editingCertification.id, ...payload } : payload;

      const res = await fetch("/api/certifications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const details = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(details?.message ?? "Failed to save certification");
      }

      toast.success(editingCertification ? "Certification updated" : "Certification created");
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
      setIsDialogOpen(false);
      resetForm();
      loadCertifications();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save certification");
    } finally {
      setIsSaving(false);
    }
  };

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        certifications
          .map((cert) => cert.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );
    return ["All", ...values];
  }, [certifications]);

  const groupedCertifications = useMemo(() => {
    const filtered =
      selectedCategory === "All"
        ? certifications
        : certifications.filter((cert) => cert.category === selectedCategory);

    const groups = filtered.reduce((acc, cert) => {
      const key = cert.group ?? "other";
      if (!acc[key]) acc[key] = [] as CertificationRecord[];
      acc[key].push(cert);
      return acc;
    }, {} as Record<string, CertificationRecord[]>);

    return Object.entries(groups)
      .map(([groupId, items]) => ({
        id: groupId,
        label: certificationGroupLabels[groupId] ?? "Other",
        items,
      }))
      .filter((group) => group.items.length > 0);
  }, [certifications, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certifications management</h1>
          <p className="text-muted-foreground">Manage credentials and keep details current.</p>
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
              Add certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCertification ? "Edit certification" : "Add new certification"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Certificate name</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div>
                <Label>Issuing organization</Label>
                <Input
                  value={formData.organization}
                  onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Issue date</Label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, issueDate: event.target.value }))}
                  />
                </div>
                <div>
                  <Label>Expiry date</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, expiryDate: event.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Credential ID</Label>
                  <Input
                    value={formData.credentialId}
                    onChange={(event) => setFormData((prev) => ({ ...prev, credentialId: event.target.value }))}
                  />
                </div>
                <div>
                  <Label>Verification URL</Label>
                  <Input
                    value={formData.verificationUrl}
                    onChange={(event) => setFormData((prev) => ({ ...prev, verificationUrl: event.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                />
              </div>
              <div>
                <Label>Group</Label>
                <select
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                  value={formData.group}
                  onChange={(event) => setFormData((prev) => ({ ...prev, group: event.target.value }))}
                >
                  {Object.entries(certificationGroupLabels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Certificate image</Label>
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
                  <p className="text-xs text-muted-foreground">Image will upload when you save this certification.</p>
                )}
                {formData.image && (
                  <div className="rounded-lg border border-dashed border-muted-foreground/40 p-3 space-y-3">
                    <div className="relative mx-auto h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={formData.image}
                        alt={formData.name}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Input
                    value={formData.status}
                    onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-gradient-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : editingCertification ? "Update certification" : "Create certification"}
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
                <TableHead>Certification</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Issue date</TableHead>
                <TableHead>Status</TableHead>
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
                certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium max-w-xs truncate">{cert.name}</TableCell>
                    <TableCell>{cert.organization ?? "-"}</TableCell>
                    <TableCell>
                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {cert.status ?? "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)}>
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
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {groupedCertifications.length === 0 ? (
            <div className="text-sm text-muted-foreground">No certifications found for this filter.</div>
          ) : (
            groupedCertifications.map((group) => (
              <div key={group.id} className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{group.label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{cert.name}</p>
                            <p className="text-xs text-muted-foreground">{cert.organization ?? "-"}</p>
                          </div>
                          <Badge variant="secondary">{cert.status ?? "Active"}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>
                            Issued:{" "}
                            {cert.issueDate
                              ? new Date(cert.issueDate).toLocaleDateString()
                              : "-"}
                          </p>
                          <p>
                            Expires:{" "}
                            {cert.expiryDate
                              ? new Date(cert.expiryDate).toLocaleDateString()
                              : "-"}
                          </p>
                          {cert.verificationUrl && (
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Verify credential
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
