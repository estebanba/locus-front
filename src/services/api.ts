const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined. Please check your .env files.");
}

/**
 * Generic fetch wrapper
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
}

// --- API Functions ---

export async function getWorkData(): Promise<WorkItem[]> {
  return fetchAPI<WorkItem[]>('/data/work');
}

export async function getProjectsData(): Promise<ProjectItem[]> {
  // Assuming projects.json is served from /data/projects by your backend
  // If it's still locus-back/src/data/projects.json, adjust backend route accordingly
  return fetchAPI<ProjectItem[]>('/data/projects.json'); 
}

export async function getPhotosData(): Promise<PhotoData> {
  return fetchAPI<PhotoData>('/data/photos.json');
}

/**
 * Fetches a list of image details (URL, public_id, etc.) for a specific item 
 * from a Cloudinary folder via the backend.
 * @param cloudinaryFolderPath The full Cloudinary folder path (e.g., "portfolio/work/casa-ato")
 * @returns Promise<CloudinaryImage[]>
 */
export async function getItemImageUrls(cloudinaryFolderPath: string): Promise<CloudinaryImage[]> {
  if (!cloudinaryFolderPath) {
    console.warn('getItemImageUrls called with empty cloudinaryFolderPath');
    return [];
  }
  // Ensure the folder path is suitable for a URL segment. 
  // However, Cloudinary paths can contain '/', so direct encoding might be an issue if the backend expects it raw.
  // The backend route new RegExp('^/images/(.*)$') captures it raw, so no encoding needed here.
  console.log(`/api/cloudinary/images/${cloudinaryFolderPath}`);
  return fetchAPI<CloudinaryImage[]>(`/cloudinary/images/${cloudinaryFolderPath}`);
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