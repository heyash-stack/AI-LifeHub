import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Clock,
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Moon,
  Sun,
  Flame,
  Target,
  Smile
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface ProfileData {
  id?: string;
  userId?: string;
  bio: string;
  timezone: string;
  themePreference: string;
  aiTonePreference: string;
}

const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'New York (EST/EDT, UTC-5 / UTC-4)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT, UTC-6 / UTC-5)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT, UTC-7 / UTC-6)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT, UTC-8 / UTC-7)' },
  { value: 'Europe/London', label: 'London (GMT/BST, UTC+0 / UTC+1)' },
  { value: 'Europe/Paris', label: 'Paris / Berlin (CET/CEST, UTC+1 / UTC+2)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)' },
  { value: 'Asia/Kolkata', label: 'India (IST, UTC+5:30)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT, UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST, UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT, UTC+10 / UTC+11)' },
];

const THEME_OPTIONS = [
  {
    value: 'dark',
    name: 'Dark Cyber',
    desc: 'Deep slate neon tones crafted for low-light focus',
    icon: Moon,
  },
  {
    value: 'light',
    name: 'Daylight Crisp',
    desc: 'High clarity and energetic contrast',
    icon: Sun,
  },
  {
    value: 'system',
    name: 'System Default',
    desc: 'Match your operating system color scheme',
    icon: Laptop,
  },
];

const AI_TONE_OPTIONS = [
  {
    value: 'encouraging',
    name: 'Empathetic & Encouraging',
    desc: 'Supportive, uplifting, and celebrates your micro-wins',
    badge: 'Popular',
    icon: Smile,
  },
  {
    value: 'concise',
    name: 'Direct & Concise',
    desc: 'Straightforward, actionable bullets without extra fluff',
    badge: 'Efficient',
    icon: Target,
  },
  {
    value: 'challenging',
    name: 'Tough Coach & Challenger',
    desc: 'Pushes you to hit deadlines and break past comfort zones',
    badge: 'High Performance',
    icon: Flame,
  },
];

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProfileData>({
    bio: '',
    timezone: 'UTC',
    themePreference: 'dark',
    aiTonePreference: 'encouraging',
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch current user profile
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/profile');
      return res.data.data as ProfileData;
    },
  });

  // Sync state once fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        timezone: profile.timezone || 'UTC',
        themePreference: profile.themePreference || 'dark',
        aiTonePreference: profile.aiTonePreference || 'encouraging',
      });
    }
  }, [profile]);

  // Mutation to PUT /api/v1/profile
  const updateMutation = useMutation({
    mutationFn: async (updated: Partial<ProfileData>) => {
      const res = await apiClient.put('/profile', updated);
      return res.data.data;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['profile'], saved);
      setFeedback({ type: 'success', message: 'Profile settings saved successfully!' });
      setTimeout(() => setFeedback(null), 4000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update settings. Please try again.';
      setFeedback({ type: 'error', message: msg });
      setTimeout(() => setFeedback(null), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          Loading your preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
          Account <span className="gradient-text">Settings</span> ⚙️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Personalize your LifeHub profile, AI companion tone, and workspace experience.
        </p>
      </div>

      {feedback && (
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: 'var(--radius-md)',
            border: feedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: feedback.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* User Identity Card */}
        <div className="glass-panel" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {user?.name || 'LifeHub Explorer'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>{user?.email}</span>
                <span>•</span>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {user?.role || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Profile & Bio */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <User size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Profile Biography</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Share a brief note about yourself, your current aspirations, or primary focus areas.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="e.g. Building next-gen software, training for a half-marathon, and reading 24 books this year."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              Your bio helps contextualize insights generated by your AI life assistant.
            </span>
          </div>
        </div>

        {/* Section 2: Localization & Timezone */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Clock size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Timezone & Scheduling</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Ensure your habits, reminders, and daily check-ins fire in alignment with your local clock.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Current Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: '#121824',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value} style={{ background: '#121824', color: '#fff' }}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: Theme Preference */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Palette size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Interface Theme</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Choose the visual appearance that best fits your workspace.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              const isSelected = formData.themePreference === theme.value;
              return (
                <div
                  key={theme.value}
                  onClick={() => setFormData({ ...formData, themePreference: theme.value })}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)', color: '#fff' }}>
                      <Icon size={20} />
                    </div>
                    {isSelected && <CheckCircle2 size={20} color="var(--accent-primary)" />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{theme.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{theme.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: AI Companion Tone */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Companion Tone Preference</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Customize how your AI LifeHub assistant communicates, motivates, and delivers proactive feedback.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {AI_TONE_OPTIONS.map((tone) => {
              const Icon = tone.icon;
              const isSelected = formData.aiTonePreference === tone.value;
              return (
                <div
                  key={tone.value}
                  onClick={() => setFormData({ ...formData, aiTonePreference: tone.value })}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)', color: '#fff' }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.06)', color: isSelected ? '#a5b4fc' : 'var(--text-muted)' }}>
                      {tone.badge}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{tone.name}</h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{tone.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', paddingTop: '8px' }}>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            style={{
              background: 'var(--accent-gradient)',
              border: 0,
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-glow)',
              opacity: updateMutation.isPending ? 0.7 : 1,
              transition: 'transform 0.15s ease',
            }}
          >
            <Save size={20} />
            {updateMutation.isPending ? 'Saving Preferences...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
