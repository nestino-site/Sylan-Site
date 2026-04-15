import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function getCloudinaryCloudName(): string | null {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? null;
}

export function requireCloudinaryServerConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }
  if (!configured) {
    cloudinary.config({ secure: true, cloudinary_url: cloudinaryUrl });
    configured = true;
  }
  return cloudinary;
}

export function buildCloudinaryDeliveryUrl(publicId: string): string {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}
