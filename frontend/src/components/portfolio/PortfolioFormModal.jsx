// ============================================================
// SkillAsAService — PortfolioFormModal.jsx
// Author: Praveen Gorla  |  Day 4 (updated)
//
// Changes:
//   • "Upload Image" button added beside the Image URL field.
//     Clicking it opens a hidden <input type="file"> which converts
//     the chosen file to a local object URL and sets it as imageUrl.
//     (Replace URL.createObjectURL with a real S3/Wasabi upload call
//     when the backend storage service is ready — Day 7/8.)
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';

const EMPTY_ITEM = {
  title: '',
  description: '',
  imageUrl: '',
  projectUrl: '',
};

const PortfolioFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm]       = useState(EMPTY_ITEM);
  const [errors, setErrors]   = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  /* hidden file input ref */
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({ ...EMPTY_ITEM, ...initialData });
      setPreviewUrl(initialData.imageUrl || '');
    } else {
      setForm(EMPTY_ITEM);
      setPreviewUrl('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    if (name === 'imageUrl') setPreviewUrl(value);
  };

  /* ---- Image upload handler ----------------------------------------
     Currently uses a local object URL for instant preview.
     TODO (Day 7-8): replace URL.createObjectURL with a POST to
     /api/v1/storage/upload (Cloud Storage Service → AWS S3 / Wasabi)
     and use the returned CDN URL instead.
  ------------------------------------------------------------------- */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Validate type */
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please select a valid image file (JPG, PNG, WEBP, GIF).' }));
      return;
    }

    /* Validate size — 5 MB max */
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image must be under 5 MB.' }));
      return;
    }

    setUploading(true);
    setErrors(prev => ({ ...prev, imageUrl: undefined }));

    /* Simulate brief upload delay (remove when real API is wired) */
    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imageUrl: objectUrl }));
      setPreviewUrl(objectUrl);
      setUploading(false);
    }, 600);
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (form.projectUrl && !/^https?:\/\//i.test(form.projectUrl)) {
      next.projectUrl = 'Enter a valid URL starting with http(s)://';
    }
    if (
      form.imageUrl &&
      !form.imageUrl.startsWith('blob:') &&
      !/^https?:\/\//i.test(form.imageUrl)
    ) {
      next.imageUrl = 'Enter a valid image URL starting with http(s)://';
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...form,
      id: initialData?.id ?? `portfolio_${Date.now()}`,
    });
  };

  /* ---- Upload button styles ---- */
  const uploadBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '0 12px',
    height: 40,
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-border)',
    background: uploading ? 'var(--color-bg-hover)' : 'var(--color-bg-input)',
    color: uploading ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-family)',
    cursor: uploading ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'background var(--transition-fast), color var(--transition-fast)',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 12, 24, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* ---- Modal Header ---- */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h6
            style={{
              margin: 0,
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-family)',
            }}
          >
            {initialData ? 'Edit portfolio item' : 'Add portfolio item'}
          </h6>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-input)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ---- Form ---- */}
        <form
          onSubmit={handleSubmit}
          style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {/* Project Title */}
          <AppInput
            label="Project title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. E-commerce Dashboard Redesign"
            error={errors.title}
            required
          />

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              htmlFor="description"
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-family)',
              }}
            >
              Description<span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe the project, your role, and the outcome"
              rows={4}
              style={{
                width: '100%',
                resize: 'vertical',
                background: 'var(--color-bg-input)',
                border: `1.5px solid ${errors.description ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.description ? 'var(--color-danger)' : 'var(--color-border-focus)';
                e.target.style.boxShadow = '0 0 0 3px rgba(3, 90, 225, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.description && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* ---- Image URL + Upload button ---- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-family)',
              }}
            >
              Image URL
            </label>

            {/* Row: text field + upload button */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              {/* URL input (no label since we rendered it above) */}
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/screenshot.png"
                  style={{
                    width: '100%',
                    background: 'var(--color-bg-input)',
                    border: `1.5px solid ${errors.imageUrl ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.imageUrl ? 'var(--color-danger)' : 'var(--color-border-focus)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 90, 225, 0.12)';
                  }}
                  onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />

              {/* Upload trigger button */}
              <button
                type="button"
                style={uploadBtnStyle}
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                title="Upload image from your device"
              >
                <FiUploadCloud size={15} />
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>

            {/* Error or help text */}
            {errors.imageUrl ? (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
                {errors.imageUrl}
              </span>
            ) : (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Optional. Paste a URL or upload from your device (max 5 MB). Used as the card thumbnail.
              </span>
            )}

            {/* Image preview */}
            {previewUrl && (
              <div
                style={{
                  marginTop: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  maxHeight: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-bg-input)',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'contain', display: 'block' }}
                  onError={() => setPreviewUrl('')}
                />
              </div>
            )}
          </div>

          {/* Project URL */}
          <AppInput
            label="Project URL"
            name="projectUrl"
            value={form.projectUrl}
            onChange={handleChange}
            placeholder="https://your-project-link.com"
            error={errors.projectUrl}
            helpText="Optional. Link to the live project or repo."
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <AppButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" variant="primary">
              {initialData ? 'Save changes' : 'Add to portfolio'}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioFormModal;
