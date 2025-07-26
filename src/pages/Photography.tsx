import { useState, useEffect, useRef, useCallback } from 'react';
import { getPhotographyImages } from '@/services/api'; 
import PhotoGallery from '../components/gallery/PhotoGallery';
import { generateThumbnailUrl, generateHighQualityUrl, generateMobileOptimizedUrl, generateMobileThumbnailUrl } from '@/utils/cloudinary';
import { BackButton } from '@/components/ui/BackButton';
import { ChevronDown } from 'lucide-react';

// Local type for photos that will be rendered in the gallery
interface DisplayPhoto {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  category: string;
  year: string;
  topic: string;
  folder: string;
}

// Custom minimal dropdown component
interface DropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  formatLabel?: (value: string) => string;
}

const MinimalDropdown: React.FC<DropdownProps> = ({ 
  value, 
  onValueChange, 
  options, 
  placeholder,
  formatLabel 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = formatLabel ? formatLabel(value) : value;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="min-w-0">
          {value === 'all' ? placeholder : displayValue}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 py-1 bg-background z-50 min-w-32">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onValueChange(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              {formatLabel ? formatLabel(option) : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Photography = () => {
  const [allDisplayablePhotos, setAllDisplayablePhotos] = useState<DisplayPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<DisplayPhoto[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>(['all']);
  const [availableTopics, setAvailableTopics] = useState<string[]>(['all']);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < 768; // md breakpoint
      if (wasMobile !== newIsMobile) {
        setIsMobile(newIsMobile);
        console.log('🔄 Mobile state changed:', { from: wasMobile, to: newIsMobile, windowWidth: window.innerWidth });
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Remove isMobile dependency to prevent infinite loops

  const fetchAndProcessPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Starting Photography API fetch... isMobile:', isMobile);
      const response = await getPhotographyImages();
      console.log('📡 Photography API Response:', response);
      console.log('📊 Total images received:', response.length);
      
      // Log ALL folder names exactly as they come from Cloudinary
      const allFolders = response.map(img => img.metadata?.folder).filter(Boolean);
      const uniqueFolders = [...new Set(allFolders)];
      console.log('📁 ALL folder names from API:', uniqueFolders);
      
      // Log ALL topic names exactly as they come from Cloudinary  
      const allTopics = response.map(img => img.metadata?.topic).filter(Boolean);
      const uniqueTopicsFromApi = [...new Set(allTopics)];
      console.log('🏷️ ALL topic names from API:', uniqueTopicsFromApi);
      
      // Search for Thailand in any form (case-insensitive)
      const thailandVariations = ['thailand', 'Thailand', 'THAILAND'];
      console.log('🇹🇭 Searching for Thailand variations:', thailandVariations);
      
      const thailandByFolder = response.filter(img => {
        const folder = img.metadata?.folder?.toLowerCase();
        return folder && thailandVariations.some(variation => 
          folder.includes(variation.toLowerCase())
        );
      });
      
      const thailandByTopic = response.filter(img => {
        const topic = img.metadata?.topic?.toLowerCase();
        return topic && thailandVariations.some(variation => 
          topic.includes(variation.toLowerCase())
        );
      });
      
      console.log('🇹🇭 Thailand images by FOLDER search:', thailandByFolder.length, thailandByFolder);
      console.log('🇹🇭 Thailand images by TOPIC search:', thailandByTopic.length, thailandByTopic);
      
      // Check for any Asian country variations
      const asianCountries = ['thailand', 'japan', 'china', 'vietnam', 'korea', 'singapore', 'malaysia'];
      const asianImages = response.filter(img => {
        const folder = img.metadata?.folder?.toLowerCase() || '';
        const topic = img.metadata?.topic?.toLowerCase() || '';
        return asianCountries.some(country => 
          folder.includes(country) || topic.includes(country)
        );
      });
      console.log('🌏 Asian country images found:', asianImages.length, asianImages.map(img => ({ folder: img.metadata?.folder, topic: img.metadata?.topic })));

      // Log the raw metadata of first few images for inspection
      console.log('🔍 First 3 images raw metadata:', response.slice(0, 3).map(img => ({
        public_id: img.public_id,
        metadata: img.metadata
      })));

      console.log('📱 Processing images with mobile state:', isMobile);
      
      const processedPhotos: DisplayPhoto[] = response.map((img, index) => {
        const thumbnailUrl = isMobile 
          ? generateMobileThumbnailUrl(img.secure_url) 
          : generateThumbnailUrl(img.secure_url);
        const fullUrl = isMobile 
          ? generateMobileOptimizedUrl(img.secure_url) 
          : generateHighQualityUrl(img.secure_url);
        
        // Log first 3 URLs for debugging
        if (index < 3) {
          console.log(`🖼️ Image ${index + 1} URLs:`, {
            isMobile,
            original: img.secure_url,
            thumbnail: thumbnailUrl,
            full: fullUrl
          });
        }
        
        return {
          id: img.public_id,
          src: thumbnailUrl,
          fullSrc: fullUrl,
          alt: (typeof img.metadata?.alt === 'string' ? img.metadata.alt : `Photo from ${img.metadata?.topic || 'Unknown'}`),
          category: img.metadata?.topic || 'Unknown',
          year: img.metadata?.year || 'Unknown',
          topic: img.metadata?.topic || 'Unknown',
          folder: img.metadata?.folder || 'Unknown',
        };
      });

      console.log('✅ Processed photos:', processedPhotos.length);
      
      // Extract unique years and topics for filters
      const uniqueYears = Array.from(new Set(processedPhotos.map(photo => photo.year).filter((year): year is string => Boolean(year))));
      const uniqueTopicsForFilters = Array.from(new Set(processedPhotos.map(photo => photo.topic).filter((topic): topic is string => Boolean(topic))));
      
      const sortedYears: string[] = ['all', ...uniqueYears].sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return b.localeCompare(a); // Sort years descending
      });
      
      const sortedTopics: string[] = ['all', ...uniqueTopicsForFilters].sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return a.localeCompare(b); // Sort topics alphabetically
      });
      
      console.log('🗓️ Available years:', sortedYears);
      console.log('🏷️ Available topics:', sortedTopics);
      
      setAllDisplayablePhotos(processedPhotos);
      setAvailableYears(sortedYears);
      setAvailableTopics(sortedTopics);
    } catch (err) {
      console.error('❌ Error fetching photography images:', err);
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [isMobile]);

  useEffect(() => {
    fetchAndProcessPhotos();
  }, [fetchAndProcessPhotos]); // Re-fetch when mobile state changes for optimized image URLs

  // Filter photos based on selected year and topic
  useEffect(() => {
    let filtered = allDisplayablePhotos;

    if (selectedYear && selectedYear !== 'all') {
      filtered = filtered.filter(photo => photo.year === selectedYear);
    }

    if (selectedTopic && selectedTopic !== 'all') {
      filtered = filtered.filter(photo => photo.topic === selectedTopic);
    }

    setFilteredPhotos(filtered);
  }, [allDisplayablePhotos, selectedYear, selectedTopic]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-2">
          <BackButton variant="text" />
          <h1 className="text-3xl mb-2 mt-6">Photography</h1>
          <p className="text-muted-foreground">Going around my 50mm and my phone.</p>
        </div>
        <div className="text-center py-10">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-2">
          <BackButton variant="text" />
          <h1 className="text-3xl mb-2 mt-6">Photography</h1>
          <p className="text-muted-foreground">Going around my 50mm and my phone.</p>
        </div>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (filteredPhotos.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-2">
          <BackButton variant="text" />
          <h1 className="text-3xl mb-2 mt-6">Photography</h1>
          <p className="text-muted-foreground">Going around my 50mm and my phone.</p>
        </div>

        {/* Sleek Filter Dropdowns */}
        <div className="mb-6 border-b border-border/40 pb-3">
          <div className="flex justify-end">
            <div className="flex items-center gap-4">
              <MinimalDropdown 
                value={selectedTopic} 
                onValueChange={setSelectedTopic} 
                options={availableTopics} 
                placeholder="Topic" 
                formatLabel={(value) => value === 'all' ? 'All Topics' : value.charAt(0).toUpperCase() + value.slice(1)}
              />

              <MinimalDropdown 
                value={selectedYear} 
                onValueChange={setSelectedYear} 
                options={availableYears} 
                placeholder="Year" 
                formatLabel={(value) => value === 'all' ? 'All Years' : value}
              />
            </div>
          </div>
        </div>

        <div className="text-center py-20 text-muted-foreground">
          <p>No photos found with the current filters.</p>
          <p className="text-sm mt-2">Try adjusting your year or topic selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-2">
        <BackButton variant="text" />
        <h1 className="text-3xl mb-2 mt-6">Photography</h1>
        <p className="text-muted-foreground">Going around my 50mm and my phone.</p>
      </div>

      {/* Sleek Filter Dropdowns */}
      <div className="mb-6 border-b border-border/40 pb-3">
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <MinimalDropdown 
              value={selectedTopic} 
              onValueChange={setSelectedTopic} 
              options={availableTopics} 
              placeholder="Topic" 
              formatLabel={(value) => value === 'all' ? 'All Topics' : value.charAt(0).toUpperCase() + value.slice(1)}
            />

            <MinimalDropdown 
              value={selectedYear} 
              onValueChange={setSelectedYear} 
              options={availableYears} 
              placeholder="Year" 
              formatLabel={(value) => value === 'all' ? 'All Years' : value}
            />
          </div>
        </div>
      </div>

      <PhotoGallery photos={filteredPhotos} />
    </div>
  );
};

export default Photography; 