'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import '../../globals.css';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export default function CreateTicketPage() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ✅ Auth guard */
  useEffect(() => {
    if (token === undefined) return; // wait for hydration

    if (!token || !user) {
      router.replace('/login');
    }
  }, [token, user, router]);

  /* ✅ Submit handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          description,
          priority,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create ticket');
      }

      router.push('/dashboard?refresh=1');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Safe render while auth loads */
  if (!token || !user) {
    return (
      <div className="container">
        <p>Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Create Ticket</h1>

        {error && (
          <div
            style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              disabled={loading}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create Ticket'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.replace('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
