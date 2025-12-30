'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import '../globals.css';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Ticket {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: Priority;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔎 Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  /* 🔒 Auth guard */
  useEffect(() => {
    if (token === undefined) return;
    if (!token || !user) router.replace('/login');
  }, [token, user, router]);

  /* 📦 Fetch tickets */
  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tickets');
        setTickets(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token, router]);

  if (!user) {
    return (
      <div className="container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  /* 🔍 Apply filters */
  const filteredTickets = tickets
    .filter(t => !statusFilter || t.status === statusFilter)
    .filter(t => !priorityFilter || t.priority === priorityFilter);

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome <b>{user.username}</b> ({user.role})
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </div>

      {/* Create Ticket */}
      <button
        className="btn btn-primary"
        style={{ marginBottom: '15px' }}
        onClick={() => router.push('/tickets/create')}
      >
        + Create Ticket
      </button>

      {/* 🔎 Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>

      {/* States */}
      {loading && <p>Loading tickets...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filteredTickets.length === 0 && <p>No tickets found.</p>}

      {/* Ticket List */}
      {!loading && filteredTickets.length > 0 && (
        <div className="card">
          {filteredTickets.map((t) => (
            <p
              key={t.id}
              style={{ cursor: 'pointer', color: '#007bff' }}
              onClick={() => router.push(`/tickets/${t.id}`)}
            >
              #{t.id} — {t.subject} ({t.status}, {t.priority})
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
