// Client-side, unsigned Cloudinary uploads. No API secret ever touches the
// browser: the unsigned upload preset (configured in the Cloudinary console)
// is the only thing that authorizes the upload.

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  width?: number;
  height?: number;
  format?: string;
}

interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video";
  onProgress?: (percent: number) => void;
}

export function uploadToCloudinary(
  file: File,
  { folder, resourceType = "image", onProgress }: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return Promise.reject(
      new Error(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      )
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            resourceType,
            width: data.width,
            height: data.height,
            format: data.format,
          });
        } else {
          reject(new Error(data?.error?.message || "Upload failed."));
        }
      } catch {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Please check your connection."));
    xhr.send(formData);
  });
}

// Appends a Cloudinary transformation string (e.g. f_auto,q_auto,w_1200) right
// after `/upload/` so every image gets responsive, compressed delivery
// without needing a paid add-on.
export function cldTransform(url: string, transformation: string): string {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

export const cldResponsive = (url: string, width: number) =>
  cldTransform(url, `f_auto,q_auto,w_${width}`);
