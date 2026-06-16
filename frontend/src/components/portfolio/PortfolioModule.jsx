// ============================================================
// SkillAsAService — PortfolioModule.jsx
// Author: Praveen Gorla  |  Day 4
//
// Portfolio section for the Freelancer Profile page.
// Drops into FreelancerProfile.jsx (Lohith — Day 4) as a tab
// or section: <PortfolioModule />
//
// Manages local state for portfolio items (grid + add/edit/
// delete). Wire `onSave`/`onDelete` to the Portfolio API
// (Profile Service — portfolios table) when backend is ready.
// ============================================================

import React, { useState } from 'react';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import PortfolioCard from './PortfolioCard';
import PortfolioFormModal from './PortfolioFormModal';

// Sample data — remove once wired to GET /api/profile/portfolio
export const SAMPLE_PORTFOLIO = [
  {
    id: 'portfolio_1',
    title: 'E-commerce Dashboard Redesign',
    description: 'Redesigned the seller-side analytics dashboard for a mid-size e-commerce platform, improving load time by 40% and simplifying the order management flow.',
    imageUrl: '',
    projectUrl: 'https://github.com',
  },
  {
    id: 'portfolio_2',
    title: 'SaaS Landing Page',
    description: 'Built a responsive marketing site with React and Bootstrap 5, including dynamic theming and a multi-step signup flow.',
    imageUrl: '',
    projectUrl: '',
  },
];

const PortfolioModule = () => {
  const [items, setItems] = useState(SAMPLE_PORTFOLIO);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddClick = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleSave = (item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [item, ...prev];
    });
    setModalOpen(false);
  };

  return (
    <AppCard
      title="Portfolio"
      subtitle="Showcase your best work to clients"
      accentColor="cyan"
      headerRight={
        <AppButton size="sm" variant="primary" onClick={handleAddClick}>
          <FiPlus size={14} /> Add project
        </AppButton>
      }
    >
      {items.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-10) var(--space-4)',
            gap: 'var(--space-3)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            <FiBriefcase size={24} />
          </div>
          <p style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', fontFamily: 'var(--font-family)' }}>
            No portfolio items yet
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)', maxWidth: 320 }}>
            Add your first project to show clients the kind of work you deliver.
          </p>
          <AppButton variant="primary" onClick={handleAddClick} style={{ marginTop: 'var(--space-2)' }}>
            <FiPlus size={14} /> Add project
          </AppButton>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <PortfolioFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </AppCard>
  );
};

export default PortfolioModule;
