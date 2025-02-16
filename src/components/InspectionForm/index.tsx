import React, { ChangeEvent, FormEvent } from "react";
import { Button, Input } from "../../components";
import { LuTrash2, LuPlus, LuRefreshCcw } from "react-icons/lu";

import styles from "./style.module.scss";

interface ImageField {
  id: number;
  file?: File;
  preview?: string;
  label: string;
}

interface UploadedImage {
  url: string;
  label?: string;
}

interface InspectionFormProps {
  fields: ImageField[];
  imageList: UploadedImage[];
  loadingList: boolean;
  addField: () => void;
  removeField: (id: number) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>, fieldId: number) => void;
  handleLabelChange: (
    e: ChangeEvent<HTMLInputElement>,
    fieldId: number
  ) => void;
  handleSubmit: (e: FormEvent) => void;
  fetchAndSetImageList: () => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({
  fields,
  imageList,
  loadingList,
  addField,
  removeField,
  handleFileChange,
  handleLabelChange,
  handleSubmit,
  fetchAndSetImageList,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Car Inspection Form</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.map((field) => (
          <div key={field.id} className={styles.fieldRow}>
            <div className={styles.fileSection}>
              {field.preview ? (
                <img
                  src={field.preview}
                  alt="preview"
                  className={styles.preview}
                />
              ) : (
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, field.id)}
                    className={styles.fileInput}
                    id={`file-input-${field.id}`}
                  />
                  <label
                    htmlFor={`file-input-${field.id}`}
                    className={styles.fileInputLabel}
                  >
                    <LuPlus />
                    image
                  </label>
                </div>
              )}
            </div>
            <div className={styles.inputSection}>
              <Input
                type="text"
                placeholder="Enter image label"
                value={field.label}
                onChange={(e) => handleLabelChange(e, field.id)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.removeButtonSection}>
              <Button
                type="button"
                variant="remove"
                onClick={() => removeField(field.id)}
                icon={LuTrash2}
                label=""
              />
            </div>
          </div>
        ))}
        <div className={styles.buttons}>
          <Button
            type="button"
            variant="add"
            onClick={addField}
            icon={LuPlus}
            label="Add Image Field"
          />
          <Button type="submit" variant="submit" label="Submit Inspection" />
        </div>
      </form>
      <div className={styles.imageList}>
        <div className={styles.imageListHeader}>
          <h3>Stored Images</h3>
          <Button
            type="button"
            variant="refresh"
            onClick={fetchAndSetImageList}
            disabled={loadingList}
            icon={LuRefreshCcw}
            label={loadingList ? "Loading..." : "Refresh"}
          />
        </div>
        <div className={styles.imageGrid}>
          {imageList.length === 0 && (
            <p className={styles.message}>No images found.</p>
          )}
          {imageList.map((img, index) => (
            <div key={index} className={styles.imageItem}>
              <img src={img.url} alt={`Stored ${index}`} />
              {img.label && <p>{img.label}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;
