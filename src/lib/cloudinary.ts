import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mock",
  api_key: process.env.CLOUDINARY_API_KEY || "mock",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mock",
});

export async function uploadImage(fileBase64: string, folder: string = "earthcentric"): Promise<string> {
  const isMock = !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "mock";
  
  if (isMock) {
    // Standard delay to simulate upload network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (folder.includes("verification") || folder.includes("document")) {
      // Returns a mock business document preview (PDF/Cert style mockup image)
      return "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=60";
    }
    // Returns a mock premium product image
    return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60";
  }

  try {
    // If the fileBase64 doesn't have the mime type prefix, add it if required, or upload directly
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: folder,
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error, falling back to mock:", error);
    return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60";
  }
}
