'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import '../../globals.css';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: string;
  createdByUsername: string;
  assignedToUsername?: string;
}

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();

  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* 🔒 Auth guard */
  useEffect(() => {
    if (token === undefined) return;
    if (!token) router.replace('/login');
  }, [token, router]);

  /* 🎫 Fetch ticket */
  useEffect(() => {
    if (!token || !ticketId) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/tickets/${ticketId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Failed to load ticket');
        setTicket(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [token, ticketId]);

  /* 💬 Fetch comments */
  useEffect(() => {
    if (!token || !ticketId) return;

    fetch(`http://localhost:8081/api/comments/ticket/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setComments)
      .catch(() => {});
  }, [token, ticketId]);

  /* 🔄 Update ticket status */
  const updateStatus = async (newStatus: Ticket['status']) => {
    if (!ticket) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/tickets/${ticket.id}/status?status=${newStatus}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to update status');

      const updated = await res.json();
      setTicket(updated);
    } catch {
      alert('Failed to update status');
    }
  };

  /* ➕ Submit comment */
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:8081/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: Number(ticketId),
          content: commentContent,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  /* ⏳ Loading / Error */
  if (loading) {
    return (
      <div className="container">
        <p>Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container">
        <p>{error || 'Ticket not found.'}</p>
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Ticket Info */}
      <div className="card">
        <button className="btn btn-secondary" onClick={() => router.back()}>
          ← Back
        </button>

        <h1 style={{ marginTop: '15px' }}>Ticket #{ticket.id}</h1>

        <p><b>Subject:</b> {ticket.subject}</p>
        <p><b>Description:</b> {ticket.description}</p>

        {/* ✅ STATUS DROPDOWN */}
        <div className="form-group">
          <label><b>Status</b></label>
          <select
            value={ticket.status}
            onChange={(e) =>
              updateStatus(e.target.value as Ticket['status'])
            }
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <p><b>Priority:</b> {ticket.priority}</p>
        <p><b>Created By:</b> {ticket.createdByUsername}</p>
        {ticket.assignedToUsername && (
          <p><b>Assigned To:</b> {ticket.assignedToUsername}</p>
        )}
      </div>

      {/* Comments */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Comments</h2>

        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map(c => (
          <div key={c.id} style={{ marginBottom: '10px' }}>
            <b>{c.username}</b>{' '}
            <span style={{ fontSize: '12px', color: '#666' }}>
              {new Date(c.createdAt).toLocaleString()}
            </span>
            <div>{c.content}</div>
          </div>
        ))}

        <form onSubmit={submitComment}>
          <textarea
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            placeholder="Enter your comment..."
            rows={4}
            style={{ width: '100%', marginTop: '10px' }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
            style={{ marginTop: '10px' }}
          >
            {submitting ? 'Submitting…' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
