
"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { personalInfo } from "@/config/site";

type ProfileState = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  dribbble: string;
};

const initialProfile: ProfileState = {
  name: personalInfo.fullName,
  title: personalInfo.primaryTitle,
  email: personalInfo.email,
  phone: personalInfo.phone,
  location: personalInfo.location,
  bio: "Design systems strategist and creative coder focusing on knowledge-first platforms, design ops rituals, and bilingual product storytelling.",
  github: personalInfo.socialProfiles.github,
  linkedin: personalInfo.socialProfiles.linkedin,
  dribbble: personalInfo.socialProfiles.dribbble,
};

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState<ProfileState>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("profileData");
      if (stored) {
        try {
          return JSON.parse(stored) as ProfileState;
        } catch {
          return initialProfile;
        }
      }
    }
    return initialProfile;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
    toast.success("Profile updated successfully.");
  };

  const handleUpload = (label: string) => {
    toast.info(`${label} upload is part of the upcoming backend integration.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile management</h1>
        <p className="text-muted-foreground">
          Keep your public profile aligned with the story you want to tell.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <Label>Portrait</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Image
                    src="/profile-avatar.png"
                    alt="Batcat portrait"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleUpload("Portrait")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload new
                  </Button>
                </div>
              </div>
              <div>
                <Label>Resume / CV</Label>
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleUpload("Resume")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload resume
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="title">Role / Title</Label>
                <Input id="title" name="title" value={profileData.title} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                value={profileData.bio}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" name="github" value={profileData.github} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dribbble">Dribbble</Label>
              <Input
                id="dribbble"
                name="dribbble"
                value={profileData.dribbble}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
