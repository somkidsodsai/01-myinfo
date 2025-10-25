

import { Button } from "@/components/ui/button";
import { Link } from "@/components/shared/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-semibold text-2xl">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-muted-foreground max-w-md">
          The page you are looking for moved or never existed. Let&apos;s head back to the studio and build something new.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
