const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined. Please check your .env files.");
}

// Import fallback data files directly
import fallbackWorkData from '../fallback/data/work.json';
import fallbackProjectsData from '../fallback/data/projects.json';
import fallbackEducationData from '../fallback/data/education.json';
import fallbackPhotosData from '../fallback/data/photos.json';

/**
 * Generic fetch wrapper with fallback support
 * @param endpoint API endpoint to fetch from
 * @param fallbackData Local fallback data to use if API fails
 * @param options Fetch options
 * @returns Promise<T> - Data from API or fallback
 */
async function fetchAPIWithFallback<T>(
  endpoint: string, 
  fallbackData: T, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Attempting to fetch from API: ${url}`);
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    
    const data = await response.json() as T;
    console.log(`✅ Successfully fetched data from API: ${endpoint}`);
    return data;
    
  } catch (error) {
    console.warn(`⚠️ API call failed for ${endpoint}, using fallback data:`, error);
    console.log(`📁 Using local fallback data for ${endpoint}`);
    return fallbackData;
  }
}

/**
 * Generic fetch wrapper (original version for non-fallback endpoints)
 * @param endpoint 
 * @param options 
 * @returns Promise<T>
 * @throws Error if response is not ok
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching from URL: ${url}`); // For debugging
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`HTTP error! status: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  return response.json() as Promise<T>;
}

// --- Types ---

export interface WorkItem {
  name: string; // Added for slug/ID
  imagesPath: string; // Added for Cloudinary base path
  title: string;
  company?: string;
  summary?: string;
  details?: string[];
  techStack?: string[];
  features?: string[];
  type?: string;
  labels?: string[];
  dateFrom?: string;
  dateUntil?: string;
  url?: string;
  media?: { name: string; url: string; }[];
  github?: string;
  // Potentially other properties
  [key: string]: unknown;
}

export interface ProjectItem {
  name: string; // Added for slug/ID
  imagesPath: string; // Added for Cloudinary base path
  title: string;
  summary: string | undefined;
  details?: string[];
  technologies?: string[];
  type?: string;
  labels?: string[];
  company?: string | null;
  dateFrom?: string;
  dateUntil?: string;
  url?: string;
  images?: string[]; // This will be superseded by dynamic fetching via getItemImageUrls
  media?: { name: string; url: string; }[];
  github?: string;
  [key: string]: unknown; // It's generally better to avoid this if possible, or make it more specific
}

export interface EducationItem {
  name: string; // Added for slug/ID
  imagesPath: string; // Added for Cloudinary base path
  title: string;
  summary: string;
  details?: string[];
  techStack?: string[];
  features?: string[];
  type?: string;
  labels?: string[];
  company?: string;
  dateFrom?: string;
  dateUntil?: string;
  url?: string;
  images?: string[];
  media?: { name: string; url: string; }[];
  github?: string;
  [key: string]: unknown;
}

export interface PhotoData {
  photos: Photo[];
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
  // ... any other photo properties your application uses
}

// Represents the structure of an image object returned by our backend from Cloudinary
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  created_at?: string;
  metadata?: Record<string, unknown>;
}

// Blog post interfaces
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author?: string;
  date: string;
  tags?: string[];
  image?: string; // Keep for backward compatibility
  images?: string[]; // New array structure like work/projects
  imagesPath?: string; // New path structure like work/projects
  content: string;
  excerpt: string;
  readingTime: number;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  socialImage?: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  author?: string;
  date: string;
  tags?: string[];
  image?: string; // Keep for backward compatibility
  images?: string[]; // New array structure like work/projects
  imagesPath?: string; // New path structure like work/projects
  excerpt: string;
  readingTime: number;
  socialImage?: string; // For tooltips
}

// --- API Functions with Fallback Support ---

/**
 * Fetch work data with fallback support
 * If backend is unavailable, returns local fallback data
 */
export async function getWorkData(): Promise<WorkItem[]> {
  return fetchAPIWithFallback<WorkItem[]>('/data/work', fallbackWorkData as WorkItem[]);
}

/**
 * Fetch projects data with fallback support
 * If backend is unavailable, returns local fallback data
 */
export async function getProjectsData(): Promise<ProjectItem[]> {
  return fetchAPIWithFallback<ProjectItem[]>('/data/projects.json', fallbackProjectsData as ProjectItem[]);
}

/**
 * Fetch education data with fallback support
 * If backend is unavailable, returns local fallback data
 */
export async function getEducationData(): Promise<EducationItem[]> {
  return fetchAPIWithFallback<EducationItem[]>('/data/education.json', fallbackEducationData as EducationItem[]);
}

/**
 * Fetch photos data with fallback support
 * If backend is unavailable, returns local fallback data
 */
export async function getPhotosData(): Promise<PhotoData> {
  return fetchAPIWithFallback<PhotoData>('/data/photos.json', fallbackPhotosData as PhotoData);
}

/**
 * Fetch all blog posts summaries
 * No fallback support as blog is a new feature
 */
export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return fetchAPI<BlogPostSummary[]>('/blog');
}

/**
 * Fetch a single blog post by slug
 * No fallback support as blog is a new feature
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/blog/${slug}`);
}

/**
 * Fetch blog posts by tag
 * No fallback support as blog is a new feature
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPostSummary[]> {
  return fetchAPI<BlogPostSummary[]>(`/blog/tag/${tag}`);
}

/**
 * Fetch all blog tags
 * No fallback support as blog is a new feature
 */
export async function getBlogTags(): Promise<string[]> {
  return fetchAPI<string[]>('/blog/tags');
}

/**
 * Fetches a list of image details (URL, public_id, etc.) for a specific item 
 * from a Cloudinary folder via the backend.
 * Note: This function does not have fallback support as it relies on dynamic image fetching
 * @param cloudinaryFolderPath The full Cloudinary folder path (e.g., "portfolio/work/casa-ato")
 * @returns Promise<CloudinaryImage[]>
 */
export async function getItemImageUrls(cloudinaryFolderPath: string): Promise<CloudinaryImage[]> {
  if (!cloudinaryFolderPath) {
    console.warn('getItemImageUrls called with empty cloudinaryFolderPath');
    return [];
  }
  
  try {
    console.log(`Attempting to fetch images from: /cloudinary/images/${cloudinaryFolderPath}`);
    return await fetchAPI<CloudinaryImage[]>(`/cloudinary/images/${cloudinaryFolderPath}`);
  } catch (error) {
    console.warn(`⚠️ Failed to fetch images for ${cloudinaryFolderPath}:`, error);
    console.log(`📷 Image fetching requires backend - returning empty array`);
    return [];
  }
}

// Removed obsolete getWorkItemImages function as getItemImageUrls is more generic

// Example of how you might have called the old function (for reference, will be removed):
// export async function getWorkItemImages(workItemTitle: string): Promise<string[]> {
//   const encodedTitle = encodeURIComponent(workItemTitle);
//   return fetchAPI<string[]>(`/data/work/${encodedTitle}/images`);
// }

// Add other specific API call functions as needed, for example:
// export async function getCloudinaryImages(folderName: string): Promise<string[]> {
//   const encodedFolderName = encodeURIComponent(folderName); // Ensure folder name is safe for URL
//   return fetchAPI<string[]>(`/cloudinary/images/${encodedFolderName}`);
// }

// You can also create functions for POST, PUT, DELETE requests if needed
// Example POST:
// export async function createSomeData(data: any): Promise<any> {
//   return fetchAPI<any>('/your-post-endpoint', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// } 