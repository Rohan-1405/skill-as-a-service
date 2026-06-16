// ============================================================
// SkillAsAService — PortfolioCard.jsx
// Author: Praveen Gorla  |  Day 4
//
// Single portfolio item card. Used inside the grid on
// FreelancerProfile (Portfolio tab).
// ============================================================

import React from 'react';
import { FiExternalLink, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import AppButton from '../common/AppButton';

const PortfolioCard = ({ item, onEdit, onDelete }) => {
  const { title, description, imageUrl, projectUrl } = item;

  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--color-border-focus)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          height: 160,
          background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : 'var(--color-bg-input)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {!imageUrl && (
          <FiImage size={32} style={{ color: 'var(--color-text-muted)' }} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <h6
          style={{
            margin: 0,
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {title}
        </h6>

        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family)',
            lineHeight: 1.5,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Footer actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family)',
                fontWeight: 'var(--font-weight-medium)',
                textDecoration: 'none',
              }}
            >
              View project <FiExternalLink size={13} />
            </a>
          ) : (
            <span />
          )}

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => onEdit && onEdit(item)}
              aria-label="Edit portfolio item"
              style={iconBtnStyle}
            >
              <FiEdit2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(item)}
              aria-label="Delete portfolio item"
              style={{ ...iconBtnStyle, color: 'var(--color-danger)' }}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconBtnStyle = {
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
  transition: 'background var(--transition-fast), color var(--transition-fast)',
};

export default PortfolioCard;
