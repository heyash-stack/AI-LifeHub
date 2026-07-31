import React from 'react';
import { Sparkles, CheckCircle2, Flame, Brain, ArrowUpRight, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>
            Welcome back, <span className="gradient-text">Alex</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Here is your AI-optimized life summary and daily focus recommendations.
          </p>
        </div>

        <button style={{ background: 'var(--accent-gradient)', border: 0, color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}>
          <Plus size={18} />
          New Action Item
        </button>
      </div>

      {/* AI Smart Insight Card */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center' }}>
          <Brain size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
              AI Daily Insight
            </span>
            <Sparkles size={14} color="var(--accent-primary)" />
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
            "You complete 40% more tasks when you schedule deep focus blocks before 11:00 AM. Consider tackling 'Prepare Architecture Review' first today."
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tasks Completed</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>12 / 16</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowUpRight size={14} /> +18% from last week
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Habit Streak</span>
            <Flame size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>9 Days</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
            Morning Meditation & Reading
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>AI Tokens Consumed</span>
            <Sparkles size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>4,250</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
            42.5% of monthly quota
          </span>
        </div>
      </div>
    </div>
  );
};
