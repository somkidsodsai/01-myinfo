"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { MessageRecord } from "@/services/messages";

type MessageStatus = "unread" | "read" | "archived";

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyMessageId, setBusyMessageId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = (await res.json()) as MessageRecord[];
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load messages right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const unreadCount = useMemo(
    () => messages.filter((message) => message.status === "unread").length,
    [messages],
  );

  const updateMessageStatus = async (message: MessageRecord, status: MessageStatus, silent?: boolean) => {
    try {
      setBusyMessageId(message.id);
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updated = (await res.json()) as MessageRecord;
      setMessages((prev) => prev.map((item) => (item.id === message.id ? updated : item)));
      setSelectedMessage((prev) => (prev?.id === message.id ? updated : prev));

      if (!silent) {
        toast.success(
          status === "unread" ? "Message marked as unread" : status === "archived" ? "Message archived" : "Message marked as read",
        );
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        toast.error("Failed to update message status");
      }
      await loadMessages();
    } finally {
      setBusyMessageId(null);
    }
  };

  const deleteMessage = async (message: MessageRecord) => {
    if (!window.confirm("Delete this message permanently?")) {
      return;
    }

    try {
      setBusyMessageId(message.id);
      const res = await fetch(`/api/messages?id=${message.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete message");
      }
      setMessages((prev) => prev.filter((item) => item.id !== message.id));
      setSelectedMessage((prev) => (prev?.id === message.id ? null : prev));
      toast.success("Message deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
      await loadMessages();
    } finally {
      setBusyMessageId(null);
      setIsDialogOpen(false);
    }
  };

  const openMessage = (message: MessageRecord) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    if (message.status === "unread") {
      void updateMessageStatus(message, "read", true);
    }
  };

  const toggleReadStatus = (message: MessageRecord) => {
    const nextStatus: MessageStatus = message.status === "read" ? "unread" : "read";
    void updateMessageStatus(message, nextStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inbox</h1>
          <p className="text-muted-foreground">
            Manage workshop requests, collaboration notes, and general enquiries.
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={loadMessages} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading messages...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Inbox is clear for now.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={`cursor-pointer ${message.status === "unread" ? "bg-muted/30" : ""}`}
                    onClick={() => openMessage(message)}
                  >
                    <TableCell>
                      {message.status === "read" || message.status === "archived" ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" aria-hidden />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`font-medium ${message.status === "unread" ? "font-semibold" : ""}`}>
                          {message.name ?? "Unknown sender"}
                        </div>
                        {message.email && <div className="text-sm text-muted-foreground">{message.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell className={message.status === "unread" ? "font-medium" : ""}>
                      {message.subject ?? "(No subject)"}
                    </TableCell>
                    <TableCell>{formatDate(message.receivedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReadStatus(message)}
                          disabled={busyMessageId === message.id}
                        >
                          {message.status === "read" ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message)}
                          disabled={busyMessageId === message.id}
                        >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">From</Label>
                <p className="text-lg font-medium">{selectedMessage.name ?? "Unknown sender"}</p>
                {selectedMessage.email && <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                <p className="text-lg">{selectedMessage.subject ?? "(No subject)"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Received</Label>
                <p>{formatDate(selectedMessage.receivedAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message ?? "-"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedMessage.email && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject ?? ""}`)
                    }
                  >
                    Reply via email
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedMessage.status !== "read") {
                      void updateMessageStatus(selectedMessage, "read");
                    }
                  }}
                  disabled={busyMessageId === selectedMessage.id}
                >
                  Mark as read
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    void updateMessageStatus(selectedMessage, "archived");
                  }}
                  disabled={busyMessageId === selectedMessage.id}
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void updateMessageStatus(selectedMessage, "unread")}
                  disabled={busyMessageId === selectedMessage.id}
                >
                  Mark unread
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteMessage(selectedMessage)}
                  disabled={busyMessageId === selectedMessage.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
