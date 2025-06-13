import { HeroSection } from "@/components/HeroSection";
import { Mail } from "lucide-react";

/**
 * Home page - The main landing page showcasing Esteban's work and philosophy
 * Features a hero section with navigation links and contact information at the bottom
 * Aligned with sidebar elements for visual consistency
 */
export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content container aligned with sidebar */}
      <div className="container mx-auto px-6 pt-16 md:pt-8 pb-10 max-w-3xl flex-grow flex flex-col justify-between">
        {/* Hero Section */}
        <HeroSection 
          summary="I am a developer with a multidisciplinary background focused on leveraging data and design to make complex information easier to understand and use"
        />

        {/* Contact Section - aligned with sidebar bottom (LinkedIn link) */}
        <section>
          <div className="space-y-6">
            <div>
              <h2 className="text-base text-muted-foreground mb-4">Start a conversation</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                I'm always interested in meaningful projects that challenge conventional thinking and create real impact.
              </p>
              
              {/* Contact and Social Links - aligned with sidebar LinkedIn link */}
              <div className="flex flex-col sm:flex-row gap-3 text-base text-muted-foreground">
                <a
                  href="mailto:hello@estebanbasili.com"
                  className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
                >
                  <Mail className="h-4 w-4" />
                  Get in touch
                </a>
                <a
                  href="https://github.com/estebanba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/estebanbasili"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
                >
                  LinkedIn
                </a>
                
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
