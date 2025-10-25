"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminQuickActions } from "@/config/site";

type AdminSummaryResponse = {
  totals: {
    projects: number;
    blogPosts: number;
    certifications: number;
    messages: number;
  };
  recentMessages: Array<{
    id: string;
    name: string | null;
    subject: string | null;
    receivedAt: string | null;
  }>;
};

const statDefinitions = [
  { key: "projects" as const, title: "Projects", description: "Published case studies" },
  { key: "blogPosts" as const, title: "Blog posts", description: "Articles live on site" },
  { key: "certifications" as const, title: "Certifications", description: "Verified credentials" },
  { key: "messages" as const, title: "Messages", description: "Entries in contact inbox" },
];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/summary", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = (await res.json()) as AdminSummaryResponse;
        setSummary(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const statCards = useMemo(() => {
    if (!summary) return [];
    return statDefinitions.map((definition) => ({
      ...definition,
      value: summary.totals[definition.key] ?? 0,
    }));
  }, [summary]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Quick snapshot of Batcat&apos;s portfolio and design ops workspace.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading dashboard metrics...</p>
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <Card key={stat.key} className="hover-scale">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent inbox activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading recent messages...</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : summary && summary.recentMessages.length > 0 ? (
              <div className="space-y-4">
                {summary.recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {message.subject ?? "No subject"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {message.name ?? "Unknown sender"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.receivedAt
                          ? new Date(message.receivedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No messages yet. Once people reach out, you will see them logged here.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {adminQuickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 py-6"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
