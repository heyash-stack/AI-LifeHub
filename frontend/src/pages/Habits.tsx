import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react';
import { apiClient } from '../api/client';

export const Habits: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', description: '', frequency: 'DAILY' });

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const res = await apiClient.get('/habits');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (habit: typeof newHabit) => {
      return await apiClient.post('/habits', habit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setIsCreating(false);
      setNewHabit({ title: '', description: '', frequency: 'DAILY' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiClient.put(`/habits/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newHabit);
  };

  const toggleComplete = (id: string, completed: boolean) => {
    updateMutation.mutate({ id, data: { completed: !completed } });
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading habits...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Your <span className="gradient-text">Habits</span> 🌱</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Build consistency and track your daily progress.
          </p>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          style={{ background: 'var(--accent-gradient)', border: 0, color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}
        >
          <Plus size={18} />
          New Habit
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Create New Habit</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Habit Title (e.g. Read 10 pages)" 
              value={newHabit.title}
              onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <select 
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending} style={{ padding: '10px 16px', borderRadius: '8px', border: '0', background: 'var(--accent-gradient)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                {createMutation.isPending ? 'Saving...' : 'Save Habit'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {habits.length === 0 && !isCreating ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            You haven't added any habits yet. Start building your routine today!
          </div>
        ) : (
          habits.map((habit: any) => (
            <div key={habit.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: habit.completed ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={() => toggleComplete(habit.id, habit.completed)}
                  style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: habit.completed ? 'var(--success)' : 'var(--text-muted)' }}
                >
                  {habit.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: habit.completed ? 'line-through' : 'none' }}>
                    {habit.title}
                  </h3>
                  {habit.description && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{habit.description}</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }} title="Edit (Coming soon)">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(habit.id)}
                  style={{ background: 'transparent', border: 0, color: 'var(--danger)', cursor: 'pointer' }}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
