import { useState, useEffect } from 'react';
import { getPhotosData } from '@/services/api'; 
import type { Photo as ApiPhoto, PhotoData } from '@/services/api'; 
import { PhotoGallery } from '../components/gallery/PhotoGallery';

// Local type for photos that will be rendered, ensuring category is a string
interface DisplayPhoto extends Omit<ApiPhoto, 'category'> {
  category: string; // Make category mandatory for display
}

// This local PhotoCategory type can be used for the filter UI state
export type PhotoCategory = "All" | "Travel" | "Nature" | "Architecture" | "Street" | "Events" | "Portraits";
// This array can be used to generate filter buttons, assuming setSelectedCategory will be used by them.
export const photoCategories: PhotoCategory[] = ["All", "Travel", "Nature", "Architecture", "Street", "Events", "Portraits"];

/**
 * Photography page component with photo gallery.
 * 
 * Displays a collection of photographs in a responsive gallery format
 * with category filtering functionality.
 */
export function Photography() {
  const [allDisplayablePhotos, setAllDisplayablePhotos] = useState<DisplayPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<DisplayPhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: PhotoData = await getPhotosData();
        
        const displayablePhotos = (data.photos || []).filter(
          (photo): photo is DisplayPhoto => typeof photo.category === 'string' && photoCategories.includes(photo.category as PhotoCategory)
        );

        setAllDisplayablePhotos(displayablePhotos); 
        setFilteredPhotos(displayablePhotos); 
      } catch (e) {
        console.error("Failed to fetch photos:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred while fetching photos.");
        setAllDisplayablePhotos([]); 
        setFilteredPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessPhotos();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPhotos(allDisplayablePhotos);
    } else {
      setFilteredPhotos(allDisplayablePhotos.filter(photo => photo.category === selectedCategory));
    }
  }, [selectedCategory, allDisplayablePhotos]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Photography</h1>
          <p className="text-muted-foreground">A collection of my favorite photographs from around the world.</p>
        </div>
        {/* UI for category selection would go here, using photoCategories and setSelectedCategory */}
        <div className="text-center py-10">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Photography</h1>
          <p className="text-muted-foreground">A collection of my favorite photographs from around the world.</p>
        </div>
        {/* UI for category selection would go here */}
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Photography</h1>
        <p className="text-muted-foreground">A collection of my favorite photographs from around the world.</p>
      </div>

      {/* Placeholder for Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {photoCategories.map(category => (
          <button 
            key={category} 
            onClick={() => setSelectedCategory(category)} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${selectedCategory === category 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPhotos.length > 0 ? (
      <PhotoGallery 
          photos={filteredPhotos} 
        className="mb-8" 
      />
      ) : (
        <p className="text-center text-muted-foreground">No photos found for the selected category.</p>
      )}
    </div>
  );
} 