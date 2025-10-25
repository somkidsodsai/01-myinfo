

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { adminSettingsDefaults } from "@/config/site";

export default function AdminSettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "Batcat - Design Desk",
    siteDescription: "Clarity-first product design and design ops experiments by Batcat.",
    contactEmail: adminSettingsDefaults.autoReply.message.match(/[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] ?? "hello@batcat.design",
    timezone: "Asia/Bangkok",
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Batcat - Product Design Lead & Creative Coder",
    metaDescription:
      "Product design lead in Bangkok building knowledge platforms, design systems, and team rituals.",
    googleAnalytics: "G-XXXX12345",
    sitemap: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#1fb6ff",
    darkMode: false,
    showBadge: true,
  });

  const saveSiteSettings = () => {
    localStorage.setItem("batcat_site_settings", JSON.stringify(siteSettings));
    toast.success("Site settings saved.");
  };

  const saveSEOSettings = () => {
    localStorage.setItem("batcat_seo_settings", JSON.stringify(seoSettings));
    toast.success("SEO settings saved.");
  };

  const saveAppearanceSettings = () => {
    localStorage.setItem("batcat_appearance_settings", JSON.stringify(appearanceSettings));
    toast.success("Appearance settings saved.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Workspace settings</h1>
        <p className="text-muted-foreground">
          Tune the portfolio surface, metadata, and internal workflows.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="auto-reply">Auto-reply</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteTitle">Site title</Label>
                <Input
                  id="siteTitle"
                  value={siteSettings.siteTitle}
                  onChange={(event) => setSiteSettings((prev) => ({ ...prev, siteTitle: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site description</Label>
                <Textarea
                  id="siteDescription"
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(event) =>
                    setSiteSettings((prev) => ({ ...prev, siteDescription: event.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(event) =>
                    setSiteSettings((prev) => ({ ...prev, contactEmail: event.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={siteSettings.timezone}
                  onChange={(event) =>
                    setSiteSettings((prev) => ({ ...prev, timezone: event.target.value }))
                  }
                />
              </div>
              <Button onClick={saveSiteSettings} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save general settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta title</Label>
                <Input
                  id="metaTitle"
                  maxLength={60}
                  value={seoSettings.metaTitle}
                  onChange={(event) =>
                    setSeoSettings((prev) => ({ ...prev, metaTitle: event.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoSettings.metaTitle.length}/60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  maxLength={160}
                  value={seoSettings.metaDescription}
                  onChange={(event) =>
                    setSeoSettings((prev) => ({ ...prev, metaDescription: event.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoSettings.metaDescription.length}/160 characters
                </p>
              </div>
              <div>
                <Label htmlFor="ga">Google Analytics ID</Label>
                <Input
                  id="ga"
                  value={seoSettings.googleAnalytics}
                  onChange={(event) =>
                    setSeoSettings((prev) => ({ ...prev, googleAnalytics: event.target.value }))
                  }
                  placeholder="G-XXXX12345"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Generate sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically regenerate sitemap.xml after each publish.
                  </p>
                </div>
                <Switch
                  checked={seoSettings.sitemap}
                  onCheckedChange={(checked) =>
                    setSeoSettings((prev) => ({ ...prev, sitemap: checked }))
                  }
                />
              </div>
              <Button onClick={saveSEOSettings} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save SEO settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary colour</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(event) =>
                      setAppearanceSettings((prev) => ({ ...prev, primaryColor: event.target.value }))
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={appearanceSettings.primaryColor}
                    onChange={(event) =>
                      setAppearanceSettings((prev) => ({ ...prev, primaryColor: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle preview of the dark palette in the admin workspace.
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.darkMode}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings((prev) => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show portfolio badge</Label>
                  <p className="text-sm text-muted-foreground">
                    Display the &quot;Handcrafted by Batcat&quot; badge on public pages.
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.showBadge}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings((prev) => ({ ...prev, showBadge: checked }))
                  }
                />
              </div>
              <Button onClick={saveAppearanceSettings} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save appearance settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-reply">
          <Card>
            <CardHeader>
              <CardTitle>Auto-reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Draft the message people receive when they reach out via the contact form.
              </p>
              <Textarea
                rows={4}
                defaultValue={adminSettingsDefaults.autoReply.message}
                onChange={(event) =>
                  localStorage.setItem("batcat_auto_reply", JSON.stringify({ message: event.target.value }))
                }
              />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable auto-reply</Label>
                  <p className="text-sm text-muted-foreground">
                    Send this response immediately after a message is submitted.
                  </p>
                </div>
                <Switch
                  defaultChecked={adminSettingsDefaults.autoReply.enabled}
                  onCheckedChange={(checked) =>
                    localStorage.setItem(
                      "batcat_auto_reply_enabled",
                      JSON.stringify({ enabled: checked }),
                    )
                  }
                />
              </div>
              <Button
                className="bg-gradient-primary"
                onClick={() => toast.success("Auto-reply settings saved.")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save auto-reply
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
