interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropImage(
  file: File,
  cropArea: CropArea,
  maxWidth = 1920,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions while maintaining aspect ratio
        let targetWidth = cropArea.width;
        let targetHeight = cropArea.height;

        if (targetWidth > maxWidth) {
          const ratio = maxWidth / targetWidth;
          targetWidth = maxWidth;
          targetHeight = targetHeight * ratio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the cropped image
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          targetWidth,
          targetHeight
        );

        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(croppedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

export function generateImageKey(file: File, prefix: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  return `${prefix}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Optimizes an image by resizing it while maintaining aspect ratio and quality
 * @param file The image file to optimize
 * @param maxWidth Maximum width of the optimized image (default: 1920px)
 * @param quality JPEG quality between 0-1 (default: 0.9)
 * @param preserveExif Whether to preserve EXIF data (default: true)
 * @returns A promise that resolves to the optimized File object
 */
export async function optimizeImage(
  file: File,
  maxWidth = 1920,
  quality = 0.98,
  _preserveExif = true
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions while maintaining aspect ratio
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > maxWidth) {
          const ratio = maxWidth / targetWidth;
          targetWidth = maxWidth;
          targetHeight = targetHeight * ratio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Apply some light image enhancement
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Clear the canvas with a white background (for transparent images)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // Draw the resized image with high quality
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}
