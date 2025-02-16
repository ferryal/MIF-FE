import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import { uploadImages, fetchImageList, UploadedImage } from "./api/uploadApi";
import { InspectionForm } from "./components";
import "react-toastify/dist/ReactToastify.css";

export interface ImageField {
  id: number;
  file?: File;
  preview?: string;
  label: string;
}

const App: React.FC = () => {
  const [fields, setFields] = useState<ImageField[]>([]);
  const [imageList, setImageList] = useState<UploadedImage[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Helper to generate a unique ID for each field
  const generateId = () => new Date().getTime() + Math.random();

  // Add a new empty field
  const addField = () => {
    setFields([...fields, { id: generateId(), label: "" }]);
  };

  // Remove a field by id
  const removeField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  // Handle file selection for a field
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldId: number
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > 1) {
      // For multiple files, create a new field for each file and remove the original.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          const preview = event.target?.result as string;
          setFields((prev) => [
            ...prev,
            { id: generateId(), file, preview, label: "" },
          ]);
        };
        reader.readAsDataURL(file);
      }
      removeField(fieldId);
    } else {
      // For a single file, update the current field.
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setFields((prev) =>
          prev.map((f) => (f.id === fieldId ? { ...f, file, preview } : f))
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle label change for a field
  const handleLabelChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldId: number
  ) => {
    const newLabel = e.target.value;
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, label: newLabel } : f))
    );
  };

  // Submit the form (upload images and labels) using toast notifications
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate that each field has a file and a non-empty, trimmed label
    for (const field of fields) {
      if (!field.file) {
        toast.error("Please upload an image for all fields.");
        return;
      }
      if (!field.label || field.label.trim() === "") {
        toast.error("Please provide a label for each image.");
        return;
      }
    }

    const formData = new FormData();
    fields.forEach((field) => {
      formData.append("images", field.file as File);
      formData.append("labels", field.label.trim());
    });

    try {
      await uploadImages(formData);
      toast.success("Inspection submitted successfully!");
      setFields([]);
      fetchAndSetImageList();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Submission failed.");
    }
  };

  // Fetch the list of stored images from the backend
  const fetchAndSetImageList = async () => {
    setLoadingList(true);
    try {
      const images = await fetchImageList();
      setImageList(images);
    } catch (error) {
      console.error("Error fetching image list:", error);
      toast.error("Error fetching image list.");
    }
    setLoadingList(false);
  };

  // Fetch image list on component mount
  useEffect(() => {
    fetchAndSetImageList();
  }, []);

  return (
    <div>
      <InspectionForm
        fields={fields}
        imageList={imageList}
        loadingList={loadingList}
        addField={addField}
        removeField={removeField}
        handleFileChange={handleFileChange}
        handleLabelChange={handleLabelChange}
        handleSubmit={handleSubmit}
        fetchAndSetImageList={fetchAndSetImageList}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
