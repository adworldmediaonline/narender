import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface CloudinaryImageData {
  public_id: string;
  url: string;
  alt: string;
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryImageData> {
  try {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder,
            resource_type: 'auto',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result as CloudinaryUploadResult);
            else reject(new Error('Upload failed'));
          }
        );
      }
    );

    return {
      public_id: result.public_id,
      url: result.secure_url,
      alt: file.name,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export async function updateImageAltText(
  publicId: string,
  altText: string
): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.explicit(
        publicId,
        {
          context: `alt=${altText}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
  } catch (error) {
    console.error('Error updating image alt text:', error);
    // Don't throw error here as it's not critical
  }
}
