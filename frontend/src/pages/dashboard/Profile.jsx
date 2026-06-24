import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AppCard from '../../components/common/AppCard';
import { useAuthContext } from '../../context/AuthContext';
import { FREELANCER_NAV } from '../../constants/navItems';

/* ─────────────────────────────────────────
   DEMO TOGGLE — set false to start empty
───────────────────────────────────────── */
const DEMO_MODE = true;

const DEMO = {
  displayName:  'Lohith Sai Ram',
  tagline:      'Full-Stack Developer · React & Spring Boot Specialist',
  location:     'Hyderabad, Telangana, India',
  bio:          "I'm a passionate Full-Stack Developer with 2+ years of experience building scalable web applications. I specialize in React 18, Spring Boot, and cloud-native architectures.\n\nI've worked on SaaS platforms, freelancer marketplaces, and real-time chat systems. I care deeply about clean code, intuitive UX, and shipping products that actually work.\n\nCurrently open to freelance projects involving React frontends, REST API development, or end-to-end product builds.",
  skills:       ['React', 'JavaScript', 'TypeScript', 'Spring Boot', 'Node.js', 'Java', 'REST APIs', 'PostgreSQL', 'Firebase', 'Git', 'Tailwind CSS', 'Docker'],
  languages:    ['English', 'Telugu', 'Hindi'],
  experience:   'Mid-Level',
  availability: 'Part-time',
  github:       'https://github.com/lohithsairam',
  linkedin:     'https://linkedin.com/in/lohithsairam',
  portfolio:    'https://lohithsairam.dev',
  experiences: [
    {
      id: 'exp1',
      company: 'Fusion5 Technologies Pvt Ltd',
      role: 'Frontend Developer',
      startMonth: '06', startYear: '2026',
      endMonth: '', endYear: '',
      current: true,
      description: 'Building SkillAsAService — a subscription-based freelancer marketplace with React 18, custom CSS design system, and Spring Boot microservices.',
    },
    {
      id: 'exp2',
      company: 'Freelance',
      role: 'Full-Stack Developer',
      startMonth: '01', startYear: '2025',
      endMonth: '05', endYear: '2026',
      current: false,
      description: 'Delivered 5+ client projects including e-commerce platforms, SaaS dashboards, and REST APIs. Worked with React, Node.js, Firebase, and AWS.',
    },
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'React — The Complete Guide',
      issuer: 'Udemy',
      issueMonth: '03', issueYear: '2025',
      credentialId: 'UC-REACT-2025',
      credentialUrl: 'https://udemy.com/certificate/UC-REACT-2025',
    },
    {
      id: 'cert2',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueMonth: '11', issueYear: '2024',
      credentialId: 'AWS-CCP-001',
      credentialUrl: '',
    },
  ],
  projects: [
    {
      title:       'SkillAsAService — Freelancer Marketplace',
      description: 'A subscription-based freelancer marketplace built with React 18 and Spring Boot. Features multi-portal dashboards, real-time notifications, wallet system, and subscription plan management for 125+ UI screens.',
      githubUrl:   'https://github.com/lohithsairam/skill-as-a-service',
      liveUrl:     'https://skillasaservice.vercel.app',
      thumbFile: null, thumbPreview: '',
    },
    {
      title:       'LuxeStore — React E-commerce',
      description: 'Full-featured e-commerce platform with cart, wishlist, and checkout flows. Built with React Router v6 and Context API.',
      githubUrl:   'https://github.com/lohithsairam/luxestore',
      liveUrl:     'https://luxestore.vercel.app',
      thumbFile: null, thumbPreview: '',
    },
  ],
};

const DEMO_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹4,999',
    period: '/month',
    color: 'var(--color-info)',
    colorBg: 'rgba(50,220,253,0.08)',
    colorBorder: 'rgba(50,220,253,0.2)',
    features: ['Up to 2 active projects', 'Email support', 'Basic code reviews', 'GitHub access'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹9,999',
    period: '/month',
    color: 'var(--color-primary)',
    colorBg: 'rgba(26,159,224,0.08)',
    colorBorder: 'rgba(26,159,224,0.25)',
    features: ['Up to 5 active projects', 'Priority support', 'Weekly video calls', 'Code reviews', 'UI/UX feedback'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹19,999',
    period: '/month',
    color: 'var(--color-highlight)',
    colorBg: 'rgba(253,196,73,0.08)',
    colorBorder: 'rgba(253,196,73,0.2)',
    features: ['Unlimited projects', 'Dedicated support', 'Daily standups', 'Full-stack delivery', 'Source code ownership'],
  },
];

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const AVATAR_MAX_MB        = 2;
const AVATAR_ACCEPT        = ['image/jpeg', 'image/png'];
const THUMB_MAX_MB         = 5;
const EXPERIENCE_LEVELS    = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Expert'];
const AVAILABILITY_OPTS    = ['Full-time', 'Part-time', 'Weekends only', 'Not available'];
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}/;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

/* ─────────────────────────────────────────
   COMPLETENESS
───────────────────────────────────────── */
const COMPLETENESS_ITEMS = [
  { key: 'avatar',      label: 'Profile photo',         check: (s) => !!s.avatarPreview },
  { key: 'name',        label: 'Display name',           check: (s) => s.displayName.trim().length > 0 },
  { key: 'tagline',     label: 'Tagline',                check: (s) => s.tagline.trim().length > 0 },
  { key: 'location',    label: 'Location',               check: (s) => s.location.trim().length > 0 },
  { key: 'bio',         label: 'Bio (50+ chars)',         check: (s) => s.bio.trim().length >= 50 },
  { key: 'skills',      label: 'At least 1 skill',       check: (s) => s.skills.length > 0 },
  { key: 'experience',  label: 'Experience level',       check: (s) => s.experience !== '' },
  { key: 'workexp',     label: 'Work experience entry',  check: (s) => s.experiences.length > 0 },
  { key: 'cert',        label: 'At least 1 certification', check: (s) => s.certifications.length > 0 },
  { key: 'project',     label: 'At least 1 project',    check: (s) => s.projects.length > 0 },
  { key: 'social',      label: 'A social link',          check: (s) => !!(s.github || s.linkedin || s.portfolio) },
  { key: 'plan',        label: 'Subscription plan',      check: (s) => s.plans.length > 0 },
];

const getCompleteness = (state) => {
  const done = COMPLETENESS_ITEMS.filter((i) => i.check(state));
  return {
    count: done.length,
    total: COMPLETENESS_ITEMS.length,
    items: COMPLETENESS_ITEMS.map((i) => ({ ...i, done: i.check(state) })),
  };
};

const strengthLabel = (pct) => {
  if (pct < 40)  return { text: 'Beginner',     color: 'var(--color-danger)' };
  if (pct < 70)  return { text: 'Intermediate', color: 'var(--color-warning)' };
  if (pct < 100) return { text: 'Advanced',     color: 'var(--color-info)' };
  return               { text: 'Complete ✓',    color: 'var(--color-success)' };
};

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const Ico = ({ d, size = 18, fill = 'none', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d} />}
    {children}
  </svg>
);
const UploadIcon   = () => <Ico size={26} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const TrashIcon    = () => <Ico size={15} d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />;
const PlusIcon     = () => <Ico size={14} d="M12 5v14M5 12h14" />;
const CheckIcon    = () => <Ico size={14} d="M20 6L9 17l-5-5" />;
const EditIcon     = () => <Ico size={15} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const ExternalIcon = () => <Ico size={13} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />;
const ArrowIcon    = () => <Ico size={14} d="M5 12h14M12 5l7 7-7 7" />;
const AlertIcon    = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

/* ─────────────────────────────────────────
   AVATAR
───────────────────────────────────────── */
const Avatar = ({ src, size = 90, className = 'avatar-preview' }) => (
  <div className={className} style={{ width: size, height: size }}>
    {src
      ? <img src={src} alt="Profile" className="avatar-img" />
      : <span className="avatar-placeholder"><UserIcon /></span>
    }
  </div>
);

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
const Toast = ({ message, type }) => (
  <div className={`profile-toast profile-toast--${type}`}>
    {type === 'success' ? <CheckIcon /> : <AlertIcon />}
    {message}
  </div>
);

/* ─────────────────────────────────────────
   TAG INPUT
───────────────────────────────────────── */
const TagInput = ({ tags, onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const addTag = (val) => {
    const t = val.trim();
    if (t && !tags.includes(t) && tags.length < 15) onChange([...tags, t]);
    setInput('');
  };
  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));
  const handleKey = (e) => {
    if (['Enter', ',', 'Tab'].includes(e.key)) { e.preventDefault(); addTag(input); }
    if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1]);
  };
  return (
    <div className="tag-input-wrap">
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="tag-chip-remove">×</button>
        </span>
      ))}
      <input type="text" value={input}
        onChange={(e) => setInput(e.target.value.slice(0, 30))}
        onKeyDown={handleKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="tag-input-field"
      />
    </div>
  );
};

/* ─────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────── */
const Field = ({ label, hint, error, children }) => (
  <div className="profile-field">
    <label className="profile-field-label">{label}</label>
    {hint && <p className="profile-field-hint">{hint}</p>}
    {children}
    {error && <span className="profile-field-error"><AlertIcon /> {error}</span>}
  </div>
);

/* ─────────────────────────────────────────
   AVATAR UPLOADER
───────────────────────────────────────── */
const AvatarUploader = ({ preview, onFileSelect, onRemove, error }) => {
  const inputRef = useRef();
  const handleChange = (e) => { const f = e.target.files[0]; if (f) onFileSelect(f); e.target.value = ''; };
  const handleDrop   = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFileSelect(f); };
  return (
    <div className="avatar-uploader">
      <Avatar src={preview} size={100} />
      <div
        className={`avatar-dropzone${error ? ' avatar-dropzone--error' : ''}`}
        onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
      >
        <span className="avatar-dropzone-icon"><UploadIcon /></span>
        <p className="avatar-dropzone-label"><strong>Click to upload</strong> or drag & drop</p>
        <p className="avatar-dropzone-sub">JPG or PNG · Max {AVATAR_MAX_MB}MB</p>
        <input ref={inputRef} type="file" accept={AVATAR_ACCEPT.join(',')} onChange={handleChange} style={{ display: 'none' }} />
      </div>
      {preview && (
        <button type="button" className="avatar-remove-btn" onClick={onRemove}>
          <TrashIcon /> Remove photo
        </button>
      )}
      {error && <span className="profile-field-error" style={{ marginTop: 6 }}><AlertIcon /> {error}</span>}
    </div>
  );
};

/* ─────────────────────────────────────────
   COMPLETENESS BAR
───────────────────────────────────────── */
const CompletenessBar = ({ state }) => {
  const [expanded, setExpanded] = useState(false);
  const { count, total, items } = getCompleteness(state);
  const pct = Math.round((count / total) * 100);
  const { text, color } = strengthLabel(pct);
  return (
    <div className="completeness-wrap">
      <div className="completeness-header"
        onClick={() => setExpanded((p) => !p)}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((p) => !p)}>
        <div className="completeness-left">
          <span className="completeness-title">Profile Strength</span>
          <span className="completeness-label" style={{ color }}>{text}</span>
        </div>
        <div className="completeness-right">
          <span className="completeness-pct" style={{ color }}>{pct}%</span>
          <span className={`completeness-chevron${expanded ? ' open' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </div>
      <div className="completeness-track">
        <div className="completeness-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {expanded && (
        <ul className="completeness-list">
          {items.map((item) => (
            <li key={item.key} className={`completeness-item${item.done ? ' done' : ''}`}>
              <span className="completeness-item-icon">
                {item.done
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                }
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   EXPERIENCE EDITOR (single entry)
───────────────────────────────────────── */
const ExperienceEditor = ({ entry, index, onChange, onRemove }) => {
  const update = (key, val) => onChange(index, { ...entry, [key]: val });
  return (
    <div className="exp-editor-card">
      <div className="exp-editor-header">
        <span className="exp-editor-num">Experience {index + 1}</span>
        <button type="button" className="project-editor-remove" onClick={() => onRemove(index)}>
          <TrashIcon /> Remove
        </button>
      </div>
      <div className="exp-editor-body">
        <div className="exp-editor-row">
          <Field label="Company / Organisation *">
            <input type="text" placeholder="e.g. Fusion5 Technologies"
              value={entry.company} maxLength={100}
              onChange={(e) => update('company', e.target.value.slice(0, 100))}
              className="profile-input" />
          </Field>
          <Field label="Role / Title *">
            <input type="text" placeholder="e.g. Frontend Developer"
              value={entry.role} maxLength={100}
              onChange={(e) => update('role', e.target.value.slice(0, 100))}
              className="profile-input" />
          </Field>
        </div>
        <div className="exp-editor-row">
          <Field label="Start Date">
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={entry.startMonth} onChange={(e) => update('startMonth', e.target.value)} className="profile-select" style={{ flex: 1 }}>
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_NAMES[i]}</option>)}
              </select>
              <select value={entry.startYear} onChange={(e) => update('startYear', e.target.value)} className="profile-select" style={{ flex: 1 }}>
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </Field>
          <Field label="End Date">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select value={entry.endMonth} onChange={(e) => update('endMonth', e.target.value)} className="profile-select" style={{ flex: 1 }} disabled={entry.current}>
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_NAMES[i]}</option>)}
              </select>
              <select value={entry.endYear} onChange={(e) => update('endYear', e.target.value)} className="profile-select" style={{ flex: 1 }} disabled={entry.current}>
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <label className="exp-current-label">
              <input type="checkbox" checked={entry.current}
                onChange={(e) => { update('current', e.target.checked); if (e.target.checked) { update('endMonth', ''); update('endYear', ''); } }}
                style={{ marginRight: 6 }} />
              Currently working here
            </label>
          </Field>
        </div>
        <Field label="Description">
          <textarea rows={3} placeholder="What did you do? Key achievements, technologies used."
            value={entry.description} maxLength={400}
            onChange={(e) => update('description', e.target.value.slice(0, 400))}
            className="profile-textarea" />
          <span className="profile-char-count">{400 - entry.description.length} remaining</span>
        </Field>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CERTIFICATION EDITOR (single entry)
───────────────────────────────────────── */
const CertEditor = ({ cert, index, onChange, onRemove }) => {
  const update = (key, val) => onChange(index, { ...cert, [key]: val });
  return (
    <div className="exp-editor-card">
      <div className="exp-editor-header">
        <span className="exp-editor-num">Certification {index + 1}</span>
        <button type="button" className="project-editor-remove" onClick={() => onRemove(index)}>
          <TrashIcon /> Remove
        </button>
      </div>
      <div className="exp-editor-body">
        <div className="exp-editor-row">
          <Field label="Certification Name *">
            <input type="text" placeholder="e.g. AWS Certified Cloud Practitioner"
              value={cert.name} maxLength={120}
              onChange={(e) => update('name', e.target.value.slice(0, 120))}
              className="profile-input" />
          </Field>
          <Field label="Issuing Organisation *">
            <input type="text" placeholder="e.g. Amazon Web Services"
              value={cert.issuer} maxLength={100}
              onChange={(e) => update('issuer', e.target.value.slice(0, 100))}
              className="profile-input" />
          </Field>
        </div>
        <div className="exp-editor-row">
          <Field label="Issue Date">
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={cert.issueMonth} onChange={(e) => update('issueMonth', e.target.value)} className="profile-select" style={{ flex: 1 }}>
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_NAMES[i]}</option>)}
              </select>
              <select value={cert.issueYear} onChange={(e) => update('issueYear', e.target.value)} className="profile-select" style={{ flex: 1 }}>
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Credential ID">
            <input type="text" placeholder="e.g. UC-REACT-2025"
              value={cert.credentialId} maxLength={80}
              onChange={(e) => update('credentialId', e.target.value.slice(0, 80))}
              className="profile-input" />
          </Field>
        </div>
        <Field label="Credential URL">
          <div className="profile-input-wrap profile-social-wrap">
            <span className="profile-social-icon"><ExternalIcon /></span>
            <input type="url" placeholder="https://udemy.com/certificate/..."
              value={cert.credentialUrl} maxLength={200}
              onChange={(e) => update('credentialUrl', e.target.value.slice(0, 200))}
              className="profile-input" />
          </div>
        </Field>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   PROJECT EDITOR (edit mode)
───────────────────────────────────────── */
const ProjectEditor = ({ project, index, onChange, onRemove }) => {
  const thumbRef = useRef();
  const [thumbError, setThumbError] = useState('');
  const update = (key, val) => onChange(index, { ...project, [key]: val });
  const handleThumb = (file) => {
    setThumbError('');
    if (!AVATAR_ACCEPT.includes(file.type)) { setThumbError('Only JPG and PNG allowed.'); return; }
    if (file.size > THUMB_MAX_MB * 1024 * 1024) { setThumbError(`Max ${THUMB_MAX_MB}MB.`); return; }
    update('thumbFile', file);
    update('thumbPreview', URL.createObjectURL(file));
  };
  return (
    <div className="project-editor-card">
      <div className="project-editor-header">
        <span className="project-editor-num">Project {index + 1}</span>
        <button type="button" className="project-editor-remove" onClick={() => onRemove(index)}>
          <TrashIcon /> Remove
        </button>
      </div>
      <div className="project-editor-body">
        <div
          className={`project-thumb-drop${thumbError ? ' error' : ''}`}
          style={project.thumbPreview ? { backgroundImage: `url(${project.thumbPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleThumb(f); }}
          onClick={() => thumbRef.current.click()}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && thumbRef.current.click()}
        >
          {!project.thumbPreview && (
            <div className="project-thumb-placeholder">
              <UploadIcon />
              <span>Upload thumbnail</span>
              <small>JPG / PNG · Max {THUMB_MAX_MB}MB</small>
            </div>
          )}
          {project.thumbPreview && (
            <button type="button" className="project-thumb-clear"
              onClick={(e) => { e.stopPropagation(); update('thumbPreview', ''); update('thumbFile', null); }}>×</button>
          )}
          <input ref={thumbRef} type="file" accept={AVATAR_ACCEPT.join(',')}
            onChange={(e) => { const f = e.target.files[0]; if (f) handleThumb(f); e.target.value = ''; }}
            style={{ display: 'none' }} />
        </div>
        {thumbError && <span className="profile-field-error" style={{ gridColumn: '1/-1' }}><AlertIcon /> {thumbError}</span>}
        <div className="project-editor-fields">
          <Field label="Project Title *">
            <input type="text" placeholder="e.g. E-commerce Dashboard"
              value={project.title}
              onChange={(e) => update('title', e.target.value)}
              className="profile-input" maxLength={80} />
          </Field>
          <Field label="Description">
            <textarea rows={3} placeholder="What did you build? What technologies did you use?"
              value={project.description}
              onChange={(e) => { if (e.target.value.length <= 500) update('description', e.target.value); }}
              className="profile-textarea" />
            <span className="profile-char-count">{500 - project.description.length} remaining</span>
          </Field>
          <div className="project-editor-links">
            <Field label="GitHub Link">
              <div className="profile-input-wrap profile-social-wrap">
                <span className="profile-social-icon"><GithubIcon /></span>
                <input type="url" placeholder="https://github.com/you/project"
                  value={project.githubUrl}
                  onChange={(e) => update('githubUrl', e.target.value)}
                  className="profile-input" />
              </div>
            </Field>
            <Field label="Live Link">
              <div className="profile-input-wrap profile-social-wrap">
                <span className="profile-social-icon"><ExternalIcon /></span>
                <input type="url" placeholder="https://yourproject.com"
                  value={project.liveUrl}
                  onChange={(e) => update('liveUrl', e.target.value)}
                  className="profile-input" />
              </div>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   PROJECT CARD — view mode
───────────────────────────────────────── */
const ProjectCard = ({ project }) => (
  <div className="proj-card">
    <div className="proj-card-thumb">
      {project.thumbPreview
        ? <img src={project.thumbPreview} alt={project.title} className="proj-card-thumb-img" />
        : <div className="proj-card-thumb-fallback">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
      }
    </div>
    <div className="proj-card-body">
      <h4 className="proj-card-title">{project.title || 'Untitled Project'}</h4>
      {project.description && <p className="proj-card-desc">{project.description}</p>}
      <div className="proj-card-links">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-card-btn proj-card-btn--github">
            <GithubIcon /> GitHub
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="proj-card-btn proj-card-btn--live">
            <ExternalIcon /> Live Demo
          </a>
        )}
        {!project.githubUrl && !project.liveUrl && <span className="proj-card-no-links">No links added</span>}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   EXPERIENCE CARD — view mode
───────────────────────────────────────── */
const formatMonthYear = (month, year) => {
  if (!month || !year) return '';
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
};

const ExperienceCard = ({ entry }) => (
  <div className="exp-view-card">
    <div className="exp-view-dot" />
    <div className="exp-view-body">
      <div className="exp-view-role">{entry.role}</div>
      <div className="exp-view-company">{entry.company}</div>
      <div className="exp-view-period">
        {formatMonthYear(entry.startMonth, entry.startYear)}
        {(entry.startMonth || entry.startYear) ? ' – ' : ''}
        {entry.current ? <span className="exp-view-current">Present</span> : formatMonthYear(entry.endMonth, entry.endYear)}
      </div>
      {entry.description && <p className="exp-view-desc">{entry.description}</p>}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   CERTIFICATION CARD — view mode
───────────────────────────────────────── */
const CertCard = ({ cert }) => (
  <div className="cert-view-card">
    <div className="cert-view-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    </div>
    <div className="cert-view-body">
      <div className="cert-view-name">{cert.name}</div>
      <div className="cert-view-issuer">{cert.issuer}</div>
      {(cert.issueMonth || cert.issueYear) && (
        <div className="cert-view-date">Issued {formatMonthYear(cert.issueMonth, cert.issueYear)}</div>
      )}
      {cert.credentialId && <div className="cert-view-id">Credential ID: {cert.credentialId}</div>}
      {cert.credentialUrl && (
        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="cert-view-link">
          <ExternalIcon /> Show credential
        </a>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   VIEW MODE
───────────────────────────────────────── */
const ProfileView = ({ data, onEdit }) => {
  const navigate = useNavigate();
  const {
    avatarPreview, displayName, tagline, location, bio,
    skills, experience, availability,
    github, linkedin, portfolio,
    experiences, certifications, projects, plans,
  } = data;

  const STUB_REVIEWS = [
    { id: 1, name: 'Arjun Mehta', rating: 5, date: 'May 2026', text: 'Excellent work! Delivered ahead of schedule and the code quality was outstanding.' },
    { id: 2, name: 'Priya Sharma', rating: 5, date: 'Apr 2026', text: 'Very professional. Great communicator and the final product exceeded expectations.' },
    { id: 3, name: 'Rohan Verma', rating: 4, date: 'Mar 2026', text: 'Good work overall. Minor revisions needed but handled quickly.' },
  ];
  const avgRating = (STUB_REVIEWS.reduce((a, r) => a + r.rating, 0) / STUB_REVIEWS.length).toFixed(1);

  const Stars = ({ n }) => (
    <span className="stars">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= n ? 'var(--color-highlight)' : 'none'}
          stroke="var(--color-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );

  return (
    <div className="profile-view">
      {/* Top bar */}
      <div className="profile-view-topbar">
        <div className="profile-view-badge">👁 Public profile preview</div>
        <button type="button" className="profile-edit-btn" onClick={onEdit}>
          <EditIcon /> Edit Profile
        </button>
      </div>

      {/* Hero */}
      <AppCard accentColor="blue">
        <div className="profile-view-hero">
          <Avatar src={avatarPreview} size={90} className="profile-view-avatar" />
          <div className="profile-view-hero-info">
            <h2 className="profile-view-name">{displayName || '—'}</h2>
            {tagline  && <p className="profile-view-tagline">{tagline}</p>}
            {location && <p className="profile-view-location">📍 {location}</p>}
            <div className="profile-view-meta">
              {experience   && <span className="profile-view-chip">{experience}</span>}
              {availability && <span className="profile-view-chip profile-view-chip--avail">{availability}</span>}
              <span className="profile-view-rating">
                <Stars n={Math.round(Number(avgRating))} />
                <strong>{avgRating}</strong>
                <span className="profile-view-rating-count">({STUB_REVIEWS.length} reviews)</span>
              </span>
            </div>
            {(github || linkedin || portfolio) && (
              <div className="hero-social-links">
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hero-social-btn" title="GitHub">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-btn hero-social-btn--linkedin" title="LinkedIn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {portfolio && (
                  <a href={portfolio} target="_blank" rel="noopener noreferrer" className="hero-social-btn hero-social-btn--portfolio" title="Portfolio">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </AppCard>

      {/* Body: sidebar + main */}
      <div className="profile-view-body">
        <div className="profile-view-sidebar">
          {skills.length > 0 && (
            <AppCard title="Skills">
              <div className="profile-view-tags">
                {skills.map((s) => <span key={s} className="tag-chip">{s}</span>)}
              </div>
            </AppCard>
          )}
        </div>

        <div className="profile-view-main">
          {/* About */}
          <AppCard title="About">
            {bio
              ? <p className="profile-view-bio">{bio}</p>
              : <p className="profile-view-empty">No bio added yet.</p>
            }
          </AppCard>

          {/* Work Experience */}
          {experiences.length > 0 && (
            <AppCard title="Work Experience" style={{ marginTop: 'var(--space-5)' }}>
              <div className="exp-view-list">
                {experiences.map((exp, i) => <ExperienceCard key={exp.id || i} entry={exp} />)}
              </div>
            </AppCard>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <AppCard title="Certifications" style={{ marginTop: 'var(--space-5)' }}>
              <div className="cert-view-list">
                {certifications.map((cert, i) => <CertCard key={cert.id || i} cert={cert} />)}
              </div>
            </AppCard>
          )}

          {/* Reviews */}
          <AppCard title="Client Reviews" subtitle={`${avgRating} average · ${STUB_REVIEWS.length} reviews`} style={{ marginTop: 'var(--space-5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {STUB_REVIEWS.map((r) => (
                <div key={r.id} style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>{r.name}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= r.rating ? 'var(--color-highlight)' : 'none'} stroke="var(--color-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      </div>

      {/* Portfolio — full width */}
      {projects.length > 0 && (
        <AppCard title="Portfolio" subtitle={`${projects.length} project${projects.length > 1 ? 's' : ''}`}>
          <div className="proj-cards-grid">
            {projects.map((p, i) => <ProjectCard key={i} project={p} />)}
          </div>
        </AppCard>
      )}

      {/* Subscription Plans — full width */}
      <AppCard
        title="Subscription Plans"
        subtitle="Choose a plan that fits your needs"
        accentColor="cyan"
        headerRight={
          <button className="plan-view-all-btn" onClick={() => navigate('/subscriptions')}>
            View all plans <ArrowIcon />
          </button>
        }
      >
        <div className="plans-cards-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card" style={{ borderColor: plan.colorBorder }}>
              {plan.popular && <div className="plan-card-popular">Most Popular</div>}
              <div className="plan-card-header" style={{ background: plan.colorBg }}>
                <span className="plan-card-name" style={{ color: plan.color }}>{plan.name}</span>
                <div className="plan-card-price">
                  <span className="plan-card-amount">{plan.price}</span>
                  <span className="plan-card-period">{plan.period}</span>
                </div>
              </div>
              <ul className="plan-card-features">
                {plan.features.map((f) => (
                  <li key={f} className="plan-card-feature">
                    <span style={{ color: plan.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="plan-card-btn" style={{ background: plan.color }} onClick={() => navigate('/subscriptions')}>
                Subscribe to {plan.name}
              </button>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  );
};

/* ─────────────────────────────────────────
   VALIDATE
───────────────────────────────────────── */
const validate = (fields) => {
  const e = {};
  const name = fields.displayName.trim();
  if (!name)               e.displayName = 'Display name is required.';
  else if (name.length > 60) e.displayName = 'Max 60 characters.';
  if (fields.tagline.length > 100) e.tagline = 'Max 100 characters.';
  if (fields.bio.length > 1000)    e.bio = 'Max 1000 characters.';
  if (fields.github    && !URL_REGEX.test(fields.github))    e.github    = 'Enter a valid URL (e.g. https://github.com/you)';
  if (fields.linkedin  && !URL_REGEX.test(fields.linkedin))  e.linkedin  = 'Enter a valid URL';
  if (fields.portfolio && !URL_REGEX.test(fields.portfolio)) e.portfolio = 'Enter a valid URL';
  fields.projects.forEach((p, i) => {
    if (p.githubUrl && !URL_REGEX.test(p.githubUrl)) e[`proj_github_${i}`] = `Project ${i + 1}: invalid GitHub URL`;
    if (p.liveUrl   && !URL_REGEX.test(p.liveUrl))   e[`proj_live_${i}`]   = `Project ${i + 1}: invalid live URL`;
  });
  fields.certifications.forEach((c, i) => {
    if (c.credentialUrl && !URL_REGEX.test(c.credentialUrl)) e[`cert_url_${i}`] = `Cert ${i + 1}: invalid URL`;
  });
  return e;
};

const newProject = () => ({ title: '', description: '', githubUrl: '', liveUrl: '', thumbFile: null, thumbPreview: '' });
const newExperience = () => ({ id: Date.now().toString(), company: '', role: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' });
const newCert = () => ({ id: Date.now().toString(), name: '', issuer: '', issueMonth: '', issueYear: '', credentialId: '', credentialUrl: '' });

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Profile = () => {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const [mode, setMode] = useState('edit');

  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError,   setAvatarError]   = useState('');

  const [displayName,     setDisplayName]     = useState(DEMO_MODE ? DEMO.displayName     : (user?.name || ''));
  const [tagline,         setTagline]         = useState(DEMO_MODE ? DEMO.tagline         : '');
  const [location,        setLocation]        = useState(DEMO_MODE ? DEMO.location        : '');
  const [bio,             setBio]             = useState(DEMO_MODE ? DEMO.bio             : '');
  const [skills,          setSkills]          = useState(DEMO_MODE ? DEMO.skills          : []);
  const [languages,       setLanguages]       = useState(DEMO_MODE ? DEMO.languages       : ['English']);
  const [experience,      setExperience]      = useState(DEMO_MODE ? DEMO.experience      : '');
  const [availability,    setAvailability]    = useState(DEMO_MODE ? DEMO.availability    : '');
  const [github,          setGithub]          = useState(DEMO_MODE ? DEMO.github          : '');
  const [linkedin,        setLinkedin]        = useState(DEMO_MODE ? DEMO.linkedin        : '');
  const [portfolio,       setPortfolio]       = useState(DEMO_MODE ? DEMO.portfolio       : '');
  const [experiences,     setExperiences]     = useState(DEMO_MODE ? DEMO.experiences     : []);
  const [certifications,  setCertifications]  = useState(DEMO_MODE ? DEMO.certifications  : []);
  const [projects,        setProjects]        = useState(DEMO_MODE ? DEMO.projects        : []);
  const plans = DEMO_PLANS;

  const [errors, setErrors] = useState({});
  const clearError = (key) => errors[key] && setErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const handleAvatarSelect = (file) => {
    setAvatarError('');
    if (!AVATAR_ACCEPT.includes(file.type)) { setAvatarError('Only JPG and PNG allowed.'); return; }
    if (file.size > AVATAR_MAX_MB * 1024 * 1024) { setAvatarError(`Max ${AVATAR_MAX_MB}MB.`); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const handleAvatarRemove = () => { setAvatarFile(null); setAvatarPreview(''); setAvatarError(''); };

  const addProject    = () => { if (projects.length < 10) setProjects([...projects, newProject()]); };
  const removeProject = (i) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i, val) => setProjects(projects.map((p, idx) => idx === i ? val : p));

  const addExperience    = () => { if (experiences.length < 10) setExperiences([...experiences, newExperience()]); };
  const removeExperience = (i) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = (i, val) => setExperiences(experiences.map((e, idx) => idx === i ? val : e));

  const addCert    = () => { if (certifications.length < 20) setCertifications([...certifications, newCert()]); };
  const removeCert = (i) => setCertifications(certifications.filter((_, idx) => idx !== i));
  const updateCert = (i, val) => setCertifications(certifications.map((c, idx) => idx === i ? val : c));

  const handleSave = async () => {
    const e = validate({ displayName, tagline, bio, github, linkedin, portfolio, projects, certifications });
    setErrors(e);
    if (Object.keys(e).length) { showToast('Please fix the errors below.', 'error'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSaving(false);
    showToast('Profile saved successfully!', 'success');
    setMode('view');
  };

  const showToast = (msg, type) => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3500); };

  const bioLeft = 1000 - bio.length;

  const profileData = {
    avatarPreview, displayName, tagline, location, bio,
    skills, languages, experience, availability,
    github, linkedin, portfolio,
    experiences, certifications, projects, plans,
  };

  /* ── VIEW MODE ── */
  if (mode === 'view') {
    return (
      <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal" pageSubtitle="Your public profile">
        {toast && <Toast message={toast.message} type={toast.type} />}
        <ProfileView data={profileData} onEdit={() => setMode('edit')} />
      </DashboardLayout>
    );
  }

  /* ── EDIT MODE ── */
  return (
    <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal" pageSubtitle="Manage your public profile">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="page-header">
        <h1>Edit Profile</h1>
        <p>This information is displayed on your public freelancer page.</p>
      </div>

      <CompletenessBar state={profileData} />

      <div className="profile-grid">

        {/* ── LEFT ── */}
        <div className="profile-col-left">

          <AppCard title="Profile Photo" subtitle="Shown on your public profile" accentColor="blue">
            <AvatarUploader preview={avatarPreview} onFileSelect={handleAvatarSelect} onRemove={handleAvatarRemove} error={avatarError} />
          </AppCard>

          <AppCard title="Professional Info" subtitle="Helps clients find the right fit" accentColor="gold" style={{ marginTop: 'var(--space-5)' }}>
            <div className="profile-fields">
              <Field label="Experience Level">
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="profile-select">
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Availability">
                <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="profile-select">
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
            </div>
          </AppCard>

          <AppCard
            title="Subscription Plans"
            subtitle="Managed on the Subscriptions page"
            style={{ marginTop: 'var(--space-5)' }}
            headerRight={
              <button className="plan-manage-btn" onClick={() => navigate('/subscriptions')}>
                Manage <ArrowIcon />
              </button>
            }
          >
            <div className="plan-summary-list">
              {DEMO_PLANS.map((plan) => (
                <div key={plan.id} className="plan-summary-item" style={{ '--plan-color': plan.color }}>
                  <span className="plan-summary-dot" style={{ background: plan.color }} />
                  <span className="plan-summary-name">{plan.name}</span>
                  <span className="plan-summary-price">{plan.price}<small>/mo</small></span>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard title="Social Links" subtitle="Let clients verify your work" style={{ marginTop: 'var(--space-5)' }}>
            <div className="profile-fields">
              <Field label="GitHub" error={errors.github}>
                <div className="profile-input-wrap profile-social-wrap">
                  <span className="profile-social-icon"><GithubIcon /></span>
                  <input type="url" placeholder="https://github.com/username" value={github} maxLength={100}
                    onChange={(e) => { setGithub(e.target.value.slice(0, 100)); clearError('github'); }}
                    className={`profile-input${errors.github ? ' error' : ''}`} />
                </div>
              </Field>
              <Field label="LinkedIn" error={errors.linkedin}>
                <div className="profile-input-wrap profile-social-wrap">
                  <span className="profile-social-icon" style={{ color: '#0A66C2' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>
                  <input type="url" placeholder="https://linkedin.com/in/username" value={linkedin} maxLength={100}
                    onChange={(e) => { setLinkedin(e.target.value.slice(0, 100)); clearError('linkedin'); }}
                    className={`profile-input${errors.linkedin ? ' error' : ''}`} />
                </div>
              </Field>
              <Field label="Portfolio Website" error={errors.portfolio}>
                <div className="profile-input-wrap profile-social-wrap">
                  <span className="profile-social-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </span>
                  <input type="url" placeholder="https://yourportfolio.com" value={portfolio} maxLength={100}
                    onChange={(e) => { setPortfolio(e.target.value.slice(0, 100)); clearError('portfolio'); }}
                    className={`profile-input${errors.portfolio ? ' error' : ''}`} />
                </div>
              </Field>
            </div>
          </AppCard>
        </div>

        {/* ── RIGHT ── */}
        <div className="profile-col-right">

          <AppCard title="Basic Information" subtitle="Your name and headline as clients will see them" accentColor="cyan">
            <div className="profile-fields">
              <Field label="Display Name *" error={errors.displayName}>
                <input type="text" placeholder="e.g. Lohith Kumar" value={displayName} maxLength={60}
                  onChange={(e) => { setDisplayName(e.target.value.slice(0, 60)); clearError('displayName'); }}
                  className={`profile-input${errors.displayName ? ' error' : ''}`} />
              </Field>
              <Field label="Tagline" hint="One line that describes what you do best." error={errors.tagline}>
                <input type="text" placeholder="e.g. React Developer · UI/UX Enthusiast" value={tagline} maxLength={100}
                  onChange={(e) => { setTagline(e.target.value.slice(0, 100)); clearError('tagline'); }}
                  className={`profile-input${errors.tagline ? ' error' : ''}`} />
                <span className={`profile-char-count${tagline.length > 90 ? ' profile-char-count--warn' : ''}`}>
                  {tagline.length}/100
                </span>
              </Field>
              <Field label="Location">
                <input type="text" placeholder="e.g. Hyderabad, India" value={location}
                  onChange={(e) => setLocation(e.target.value.slice(0, 60))} className="profile-input" maxLength={60} />
              </Field>
            </div>
          </AppCard>

          <AppCard title="About" subtitle="Tell clients about your background" style={{ marginTop: 'var(--space-5)' }}>
            <div className="profile-fields">
              <Field label="Bio" error={errors.bio}>
                <textarea rows={5} placeholder="Write a short bio about yourself..."
                  value={bio}
                  onChange={(e) => { if (e.target.value.length <= 1000) { setBio(e.target.value); clearError('bio'); } }}
                  className={`profile-textarea${errors.bio ? ' error' : ''}`} />
                <span className={`profile-char-count${bioLeft < 50 ? ' profile-char-count--warn' : ''}`}>
                  {bioLeft} characters remaining
                </span>
              </Field>
              <Field label="Skills" hint="Press Enter or comma to add. Max 15 skills.">
                <TagInput tags={skills} onChange={setSkills} placeholder="e.g. React, Node.js, UI Design..." />
              </Field>
            </div>
          </AppCard>

          {/* Work Experience */}
          <AppCard
            title="Work Experience"
            subtitle="Your employment history"
            style={{ marginTop: 'var(--space-5)' }}
            headerRight={
              experiences.length < 10 && (
                <button type="button" className="project-add-btn" onClick={addExperience}>
                  <PlusIcon /> Add Experience
                </button>
              )
            }
          >
            {experiences.length === 0
              ? (
                <div className="projects-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <p>No experience added yet</p>
                  <button type="button" className="project-add-btn" onClick={addExperience}>
                    <PlusIcon /> Add your first experience
                  </button>
                </div>
              )
              : (
                <div className="projects-editor-list">
                  {experiences.map((exp, i) => (
                    <ExperienceEditor key={exp.id || i} entry={exp} index={i} onChange={updateExperience} onRemove={removeExperience} />
                  ))}
                  {experiences.length < 10 && (
                    <button type="button" className="project-add-more-btn" onClick={addExperience}>
                      <PlusIcon /> Add another experience
                    </button>
                  )}
                </div>
              )
            }
          </AppCard>

          {/* Certifications */}
          <AppCard
            title="Certifications"
            subtitle="Courses, degrees, and credentials"
            style={{ marginTop: 'var(--space-5)' }}
            headerRight={
              certifications.length < 20 && (
                <button type="button" className="project-add-btn" onClick={addCert}>
                  <PlusIcon /> Add Certification
                </button>
              )
            }
          >
            {certifications.length === 0
              ? (
                <div className="projects-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                  <p>No certifications added yet</p>
                  <button type="button" className="project-add-btn" onClick={addCert}>
                    <PlusIcon /> Add your first certification
                  </button>
                </div>
              )
              : (
                <div className="projects-editor-list">
                  {certifications.map((cert, i) => (
                    <CertEditor key={cert.id || i} cert={cert} index={i} onChange={updateCert} onRemove={removeCert} />
                  ))}
                  {certifications.length < 20 && (
                    <button type="button" className="project-add-more-btn" onClick={addCert}>
                      <PlusIcon /> Add another certification
                    </button>
                  )}
                </div>
              )
            }
          </AppCard>

          {/* Portfolio */}
          <AppCard
            title="Portfolio"
            subtitle="Showcase your best work to clients"
            style={{ marginTop: 'var(--space-5)' }}
            headerRight={
              projects.length < 10 && (
                <button type="button" className="project-add-btn" onClick={addProject}>
                  <PlusIcon /> Add Project
                </button>
              )
            }
          >
            {projects.length === 0
              ? (
                <div className="projects-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>No projects yet</p>
                  <button type="button" className="project-add-btn" onClick={addProject}>
                    <PlusIcon /> Add your first project
                  </button>
                </div>
              )
              : (
                <div className="projects-editor-list">
                  {projects.map((p, i) => (
                    <ProjectEditor key={i} project={p} index={i} onChange={updateProject} onRemove={removeProject} />
                  ))}
                  {projects.length < 10 && (
                    <button type="button" className="project-add-more-btn" onClick={addProject}>
                      <PlusIcon /> Add another project
                    </button>
                  )}
                </div>
              )
            }
          </AppCard>

          {/* Save bar */}
          <div className="profile-save-bar">
            <p className="profile-save-hint">Changes are saved to your account and reflected on your public profile.</p>
            <button type="button"
              className={`profile-save-btn${saving ? ' saving' : ''}`}
              disabled={saving} onClick={handleSave}>
              {saving ? <><span className="spinner" /> Saving…</> : <><CheckIcon /> Save Profile</>}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;