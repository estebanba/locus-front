import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getWorkData, getItemImageUrls } from '@/services/api';
import type { WorkItem as ProjectDetailData, CloudinaryImage } from '@/services/api';
import { Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { ExpandableTags } from "@/components/ui/ExpandableTags";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

// Import company logos
import { TeslaIcon } from "@/components/icons/TeslaIcon";
import { HyphenLogo } from "@/components/icons/HyphenLogo";
import { IrArquitecturaLogo } from "@/components/icons/IrArquitecturaLogo";

// Refined IconProps to extend React.SVGAttributes for better type compatibility
interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  color?: string;
}

const companyIconMap: Record<string, React.FC<IconProps>> = {
  "Tesla": TeslaIcon as React.FC<IconProps>,
  "Hyphen": HyphenLogo as React.FC<IconProps>,
  "IR arquitectura": IrArquitecturaLogo as React.FC<IconProps>,
};

// Helper function to get specific sizing class per company for WorkDetail page
const getCompanyIconSizeClass = (companyName?: string): string => {
  switch (companyName) {
    case "Tesla":
      return "h-6 w-auto"; // Make Tesla smaller
    case "IR arquitectura":
      return "h-10 w-auto"; // Make IR larger
    case "Hyphen":
      return "h-8 w-auto"; // Default/medium size for Hyphen
    default:
      return "h-8 w-auto"; // Fallback size
  }
};

export const WorkDetail = () => {
  const { companyName, projectName } = useParams<{ companyName: string; projectName: string }>();
  const [projectDetails, setProjectDetails] = useState<ProjectDetailData | null>(null);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false); // Start false, true when fetching images
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [showCarousel, setShowCarousel] = useState(false); // For fade-in effect

  const formattedCompanyName = useMemo(() => 
    companyName
      ? companyName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : '',
  [companyName]);

  // Effect to fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!companyName || !projectName) {
        setDetailsLoading(false);
        setDetailsError("Company or project name not provided in URL.");
        return;
      }
      try {
        // Reset states for new data fetch
        setDetailsLoading(true);
        setImagesLoading(false); // Ensure imagesLoading is false before details possibly trigger image load
        setProjectDetails(null);
        setImages([]);
        setDetailsError(null);
        setImagesError(null);
        setShowCarousel(false);

        const workData = await getWorkData();

        const foundProject = workData.find(item => {
          const itemCompanySlug = item.company?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
          const itemIdentifierSlug = item.name || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
          return itemCompanySlug === companyName.toLowerCase() && itemIdentifierSlug === projectName.toLowerCase();
        });
        
        if (foundProject) {
          setProjectDetails(foundProject);
          // Note: imagesLoading will be set to true by the image fetching useEffect if applicable
        } else {
          setDetailsError("Project details not found.");
          setDetailsLoading(false); // Explicitly stop loading if not found
        }
      } catch (e) {
        console.error("Failed to fetch project details:", e);
        setDetailsError(e instanceof Error ? e.message : "An unknown error occurred fetching details");
        setDetailsLoading(false); // Stop loading on error
      } 
      // Removed finally block for setDetailsLoading(false) as it's handled in paths above
      // or will be handled implicitly when projectDetails triggers image load
    };

    fetchProjectDetails();
  }, [companyName, projectName]);

  // Effect to fetch images once project details (and title) are loaded
  useEffect(() => {
    // Only proceed if projectDetails are loaded and have necessary info
    if (projectDetails && projectDetails.imagesPath && projectDetails.name) {
      const fetchProjectImages = async () => {
        try {
          setImagesLoading(true); // Set loading true for images
          setImagesError(null);
          setShowCarousel(false); 
          
          const cloudinaryFolderPath = projectDetails.imagesPath + projectDetails.name;
          console.log("[WorkDetail] Fetching images from path:", cloudinaryFolderPath);

          const imageData = await getItemImageUrls(cloudinaryFolderPath);
          console.log("[WorkDetail] Received image data:", imageData);
          setImages(imageData);

          if (imageData.length > 0) {
            setTimeout(() => setShowCarousel(true), 50);
          }
        } catch (e) {
          console.error("Failed to fetch project images:", e);
          setImagesError(e instanceof Error ? e.message : "An unknown error occurred fetching images");
          setImages([]); 
        } finally {
          setImagesLoading(false); // Stop image loading in all cases
          // Details loading should be false by now, set it definitively if projectDetails are present
          if(projectDetails) setDetailsLoading(false);
        }
      };

      fetchProjectImages();
    } else if (projectDetails) {
      // If projectDetails are loaded but no imagesPath/name, means no images to fetch.
      // Consider image loading done for this case.
      setImagesLoading(false);
      setDetailsLoading(false); // And details loading done too.
      setImages([]); // Ensure images are empty
    }
  }, [projectDetails]); 

  // Global loading state: show if details are loading OR initial images are loading
  if (detailsLoading || (projectDetails && imagesLoading)) {
    return (
      <div className="p-4 pt-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        Loading content...
      </div>
    );
  }

  // Error state for project details
  if (detailsError) {
    return <div className="p-4 pt-8 text-red-500">Error: {detailsError}</div>;
  }

  // Project not found state (after all loading is complete)
  if (!projectDetails) {
    return (
      <div className="p-4 pt-8 flex flex-col space-y-4 items-center">
        <h2 className="text-3xl tracking-tight">Project Not Found</h2>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist or may have been moved.
        </p>
        <BackButton text={`Back to ${formattedCompanyName || 'Work'}`} variant="text" />
      </div>
    );
  }

  // --- If we reach here, details are loaded, and initial image check is complete --- 
  const CompanyIcon = projectDetails.company ? companyIconMap[projectDetails.company] : null;
  const iconSizeClass = getCompanyIconSizeClass(projectDetails.company);
  const carouselImageUrls = images.map(img => img.secure_url);

  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      <BackButton text={`Back to ${formattedCompanyName}`} variant="text" />

      <div className="w-full">
        <h1 className="text-3xl tracking-tight mb-2">{projectDetails.title}</h1>
        
        <div className="text-muted-foreground mb-4 flex items-center gap-x-3">
          {CompanyIcon && (
            projectDetails.company === "Tesla" ? (
              <span style={{ color: '#CC0000' }}> 
                <CompanyIcon className={iconSizeClass} />
              </span>
            ) : projectDetails.company === "Hyphen" ? (
              <CompanyIcon className={iconSizeClass} />
            ) : (
              <CompanyIcon className={iconSizeClass} />
            )
          )}
          <span>{projectDetails.dateFrom} {projectDetails.dateUntil ? `- ${projectDetails.dateUntil}` : ''}</span>
        </div>
        <p className="text-lg mb-8">{projectDetails.summary}</p>
      </div>

      {/* Image Section: Skeleton (while loading), Error, or Carousel */}
      {/* Note: The top-level imagesLoading might be false here if it was an initial load. */}
      {/* We rely on the imagesError or images.length for conditional rendering of content below. */}
      <div className="mb-8 w-full">
        {/* Show CarouselSkeleton only if images are actively being fetched AFTER initial page load, */}
        {/* otherwise the global loader already covered it. This might be redundant if imagesLoading is always false here. */}
        {/* For now, let's keep it simple: the global loader handles initial, CarouselSkeleton is not strictly needed here */}
        {/* if the global one covers imagesLoading. However, if images can be RE-FETCHED, it would be needed. */}
        {/* Let's assume images are only fetched once for now with this component structure. */}

        {/* Display image loading error if it occurred */}
        {!imagesLoading && imagesError && (
          <div className="p-4 text-red-500 border border-red-500 rounded-md">
            Could not load images: {imagesError}
          </div>
        )}

        {/* Display carousel if images are loaded successfully and exist */}
        {!imagesLoading && !imagesError && images.length > 0 && (
          <div className={`transition-opacity duration-500 ease-in-out ${showCarousel ? 'opacity-100' : 'opacity-0'}`}>
            <ImageCarousel 
              images={carouselImageUrls} 
              altText={projectDetails.title || 'Project image'}
              imageClassName="rounded-2xl shadow-md object-cover w-full h-auto"
              containerClassName="w-full"
            />
          </div>
        )}
        {/* No message is shown if images.length === 0 and no error, as per previous request */}
      </div>

      <div className="w-full">
        <h3 className="text-xl mb-4">Project Details</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-3 mb-8">
          {projectDetails.details?.map((detail, index) => (
            <li className="text-md" key={index}>{detail}</li>
          ))}
        </ul>
      </div>

      {projectDetails.techStack && projectDetails.techStack.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Tech Stack</h3>
          <ExpandableTags tags={projectDetails.techStack} />
        </div>
      )}

      {projectDetails.features && projectDetails.features.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Features</h3>
          <ExpandableTags tags={projectDetails.features} />
        </div>
      )}

      {projectDetails.media && projectDetails.media.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Featured On</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {projectDetails.media.map((mediaItem, index) => (
              <a
                key={index}
                href={mediaItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-secondary/30 text-muted-foreground px-3 py-1 rounded-md hover:bg-secondary/50"
              >
                <Globe className="h-4 w-4 mr-2" />
                {mediaItem.name}
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div className="w-full flex flex-wrap gap-4">
        {projectDetails.url && (
          <a 
            href={projectDetails.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button className="gap-2">
              <Globe className="h-4 w-4" />
              Visit Project
            </Button>
          </a>
        )}
        
        {projectDetails.github && (
          <a 
            href={projectDetails.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              View Code
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};