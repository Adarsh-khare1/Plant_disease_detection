'use client';

import { useState, useRef } from 'react';
import Icon from '@/components/ui/Icon';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Upload State View
 *
 * Drag-and-drop dropzone + file selection + client validation (JPEG/PNG/WebP, <= 10MB)
 * + Pre-analysis and field record privacy explanatory notes.
 */
export default function UploadState({ onFileSelected, onSelectSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndHandleFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage('Please select a supported image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('Image size exceeds 10 MB limit. Please select a smaller photo.');
      return;
    }

    setErrorMessage(null);
    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all bg-surface ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.005]'
            : 'border-outline-variant hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
          aria-label="Upload leaf photo"
        />

        {/* Camera Icon Circle */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon name="photo_camera" className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* Upload Action Prompts */}
        <h3 className="text-lg sm:text-xl font-semibold text-on-surface mb-1 font-display">
          Take a photo or upload an image
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
          Upload a clear photo of a single crop leaf. We will check the image quality before starting the analysis.
        </p>

        {/* Primary Selection Action */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-primary hover:bg-primary-container active:bg-primary-container text-on-primary rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Icon name="add_a_photo" className="w-4 h-4" />
            <span>Choose photo</span>
          </button>

          {onSelectSample && (
            <button
              type="button"
              onClick={onSelectSample}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-primary hover:bg-surface-container-high rounded font-medium text-sm transition-colors cursor-pointer"
            >
              Use sample photo
            </button>
          )}
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <div className="mt-4 p-2.5 rounded bg-[#FBF7F7] border border-[#BA1A1A]/40 text-[#BA1A1A] text-xs font-medium flex items-center gap-1.5">
            <Icon name="error" className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Format Specs */}
        <span className="text-[11px] font-mono uppercase tracking-wider text-outline mt-5">
          JPEG, PNG, or WebP • Max file size 10 MB
        </span>
      </div>

      {/* Clarifying Workspace Notes */}
      <div className="bg-surface-container-low border border-surface-variant rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-start gap-2.5">
          <Icon name="verified" className="w-4 h-4 text-surface-tint mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-on-surface">
              Pre-analysis check
            </span>
            <span className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              After upload, PlantDx will review the image quality before analysis.
            </span>
          </div>
        </div>

        <div className="h-px bg-surface-variant" />

        <div className="flex items-start gap-2.5">
          <Icon name="lock" className="w-4 h-4 text-outline mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-on-surface">
              About your image
            </span>
            <span className="text-[11px] sm:text-xs text-outline leading-relaxed">
              Your image is currently used only within this prototype flow. Storage and retention behavior will be finalized with backend integration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
