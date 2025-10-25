"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactCards, contactSocials, personalInfo } from "@/config/site";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Incomplete message",
        description: "Let me know who you are and what you&apos;d like to collaborate on.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "Thanks for reaching outI&apos;ll reply within one business day.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-background">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Let&apos;s Build <span className="bg-gradient-primary bg-clip-text text-transparent">Clarity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Ready to explore a knowledge platform, design ops ritual, or workshop? Tell me about the team and what outcome you are chasing.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            <Card className="p-8 shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Send a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Project idea or workshop"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Share a bit about the team, challenge, and timeline."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:opacity-90 shadow-glow gap-2">
                  <Send size={18} />
                  Send message
                </Button>
              </form>
            </Card>

            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "120ms" }}>
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactCards.map((info) => {
                    const Icon = info.icon;
                    return (
                      <Card key={info.title} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                            <Icon size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{info.title}</h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-muted-foreground">{info.content}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Card className="p-8">
                <h3 className="font-semibold mb-4">Connect elsewhere</h3>
                <div className="flex gap-4">
                  {contactSocials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-muted hover:bg-gradient-primary hover:text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1"
                        aria-label={social.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-8 bg-gradient-primary text-white">
                <h3 className="font-semibold mb-2">Response time</h3>
                <p className="text-sm opacity-90">
                  I reply to new messages within one business day (Monday to Friday, 9 AM - 6 PM GMT+7). For urgent
                  workshops, send a WhatsApp note to {personalInfo.phone}.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
