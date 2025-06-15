import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";

/**
 * Home page - The main landing page showcasing Esteban's work and philosophy
 * Features a hero section with navigation links and contact information at the bottom
 * Aligned with sidebar elements for visual consistency
 */
export const Home = () => {
  // Hardcoded summary for now
  const summary = "Developer with a multidisciplinary background focused on leveraging data and design to make complex information easier to understand and use.";

  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-16">
        <HeroSection summary={summary} />
      </div>
      
      <Footer />
    </div>
  );
};
