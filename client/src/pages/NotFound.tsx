import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO 
        title="Page Not Found | StressGuru - 404 Error"
        description="The page you requested is not available. Return to StressGuru or use the main navigation to choose another guide."
        keywords={["404", "page not found", "StressGuru"]}
      />
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-poppins font-light text-primary">404</div>
        <h1 className="font-poppins text-4xl font-normal text-foreground">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The page you requested is not available. Return home to choose another guide.
        </p>
        <Link href="/">
          <a>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
