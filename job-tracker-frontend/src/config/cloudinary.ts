// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dmi9k62p1",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "jobtracker_unsigned",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
}; 