'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { adminAPI, ticketAPI } from '@/lib/api';
import { User, Ticket, Role, TicketStatus, Priority } from '@/types';
import '@/app/globals.css';

export default function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [supportAgents, setSupportAgents] = useState<User[]>([]);

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: Role.USER,
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, router, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'users') {
        const response = await adminAPI.getAllUsers();
        setUsers(response.data);
      } else {
        const response = await adminAPI.getAllTickets();
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, userForm);
      } else {
        await adminAPI.createUser(userForm);
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: Role.USER,
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleViewTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
    // Load support agents for assignment dropdown
    try {
      const response = await adminAPI.getUsersByRole(Role.SUPPORT_AGENT);
      setSupportAgents(response.data);
    } catch (error) {
      console.error('Failed to load support agents:', error);
    }
  };

  const handleUpdateTicket = async (ticketId: number, updates: any) => {
    try {
      await adminAPI.updateTicket(ticketId, updates);
      loadData();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, ...updates });
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update ticket');
    }
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Admin Panel</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`btn ${activeTab === 'tickets' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tickets')}
          >
            Ticket Management
          </button>
        </div>

        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Users</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingUser(null);
                setUserForm({
                  username: '',
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  role: Role.USER,
                });
                setShowUserModal(true);
              }}>
                + Add User
              </button>
            </div>

            {loading ? (
              <div>Loading users...</div>
            ) : (
              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>
                          <span className={`badge badge-${user.role === Role.ADMIN ? 'danger' : 
                            user.role === Role.SUPPORT_AGENT ? 'warning' : 'info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.enabled ? 'badge-success' : 'badge-danger'}`}>
                            {user.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* User Modal */}
            {showUserModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div className="card" style={{ width: '500px' }}>
                  <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
                  <form onSubmit={handleCreateUser}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password {editingUser && '(leave blank to keep current)'}</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required={!editingUser}
                      />
                    </div>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })}
                      >
                        {Object.values(Role).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary">
                        {editingUser ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowUserModal(false);
                          setEditingUser(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div>
            <h2>All Tickets</h2>
            {loading ? (
              <div>Loading tickets...</div>
            ) : (
              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created By</th>
                      <th>Assigned To</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td>
                          <span className={`badge badge-${ticket.status === TicketStatus.OPEN ? 'info' : 
                            ticket.status === TicketStatus.IN_PROGRESS ? 'warning' :
                            ticket.status === TicketStatus.RESOLVED ? 'success' : 'secondary'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <span className={`priority-${ticket.priority.toLowerCase()}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>{ticket.createdByUsername}</td>
                        <td>{ticket.assignedToUsername || 'Unassigned'}</td>
                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleViewTicket(ticket)}
                          >
                            View/Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Ticket Edit Modal */}
            {showTicketModal && selectedTicket && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div className="card" style={{ width: '700px', maxHeight: '90vh', overflow: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <h2>Edit Ticket #{selectedTicket.id}</h2>
                    <button className="btn btn-secondary" onClick={() => setShowTicketModal(false)}>
                      Close
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateTicket(selectedTicket.id, { 
                        status: e.target.value as TicketStatus 
                      })}
                    >
                      {Object.values(TicketStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => handleUpdateTicket(selectedTicket.id, { 
                        priority: e.target.value as Priority 
                      })}
                    >
                      {Object.values(Priority).map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Assign To</label>
                    <select
                      value={selectedTicket.assignedToId || ''}
                      onChange={async (e) => {
                        const userId = e.target.value ? parseInt(e.target.value) : null;
                        await handleUpdateTicket(selectedTicket.id, { 
                          assignedToId: userId || undefined 
                        });
                      }}
                    >
                      <option value="">Unassigned</option>
                      {supportAgents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.username} ({agent.firstName} {agent.lastName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <h3>Ticket Details</h3>
                    <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                    <p><strong>Description:</strong> {selectedTicket.description}</p>
                    <p><strong>Created by:</strong> {selectedTicket.createdByUsername}</p>
                    {selectedTicket.assignedToUsername && (
                      <p><strong>Assigned to:</strong> {selectedTicket.assignedToUsername}</p>
                    )}
                    {selectedTicket.rating && (
                      <p><strong>Rating:</strong> {selectedTicket.rating} ⭐</p>
                    )}
                    {selectedTicket.feedback && (
                      <p><strong>Feedback:</strong> {selectedTicket.feedback}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

