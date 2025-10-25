import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "@/components/shared/link";
import { personalInfo } from "@/config/site";

const ContactCTA = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-1 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-primary opacity-50 blur-2xl"></div>
            
            <div className="relative bg-background rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow mb-4">
                  <Mail className="text-white" size={32} />
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Let&apos;s Build <span className="bg-gradient-primary bg-clip-text text-transparent">Clarity</span> Together
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ready to align your product rituals, launch a knowledge hub, or co-design a workshop? I love partnering with teams who are brave about transparency and impact.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                    <Link href="/contact">
                      Start a conversation <ArrowRight className="ml-2" size={20} />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={`mailto:${personalInfo.email}`}>
                      <Mail className="mr-2" size={20} />
                      Email Batcat
                    </a>
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground pt-4">
                  Response time: <span className="font-semibold text-primary">Within one business day (GMT+7)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
