import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, CheckSquare, Square, Edit2, Calendar, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/tasks');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      return await apiClient.post('/tasks', task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreating(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiClient.put(`/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newTask);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading tasks...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Your <span className="gradient-text">Tasks</span> ✅</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your daily action items and priorities.
          </p>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          style={{ background: 'var(--accent-gradient)', border: 0, color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Create New Task</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Task Title (e.g. Complete Architecture Review)" 
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due Date</label>
                <input 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending} style={{ padding: '10px 16px', borderRadius: '8px', border: '0', background: 'var(--accent-gradient)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                {createMutation.isPending ? 'Saving...' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length === 0 && !isCreating ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tasks found. You're all caught up!
          </div>
        ) : (
          tasks.map((task: any) => {
            const isCompleted = task.status === 'COMPLETED';
            
            return (
              <div key={task.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: isCompleted ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <button 
                    onClick={() => toggleStatus(task.id, task.status)}
                    style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: isCompleted ? 'var(--success)' : 'var(--text-muted)', marginTop: '4px' }}
                  >
                    {isCompleted ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                    )}
                    
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={12} /> {task.priority}
                      </span>
                      {task.dueDate && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }} title="Edit (Coming soon)">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(task.id)}
                    style={{ background: 'transparent', border: 0, color: 'var(--danger)', cursor: 'pointer' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
