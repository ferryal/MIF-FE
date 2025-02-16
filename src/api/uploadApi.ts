const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export interface UploadedImage {
  url: string;
  label?: string;
}

export interface UploadResponse {
  success: boolean;
  images: UploadedImage[];
}

/**
 * Upload images along with their labels.
 * @param formData - A FormData object containing 'images' and 'labels'.
 * @returns A promise that resolves to the upload response.
 */
export const uploadImages = async (
  formData: FormData
): Promise<UploadResponse> => {
  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Upload failed");
  }
  return response.json();
};

/**
 * Fetch the list of stored images.
 * @returns A promise that resolves to an array of uploaded images.
 */
export const fetchImageList = async (): Promise<UploadedImage[]> => {
  const response = await fetch(`${API_URL}/api/upload/list`);
  if (!response.ok) {
    throw new Error("Failed to fetch image list");
  }
  const data = await response.json();
  return data.images;
};
