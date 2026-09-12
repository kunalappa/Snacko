import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, ShieldCheck, ShieldOff, Loader2, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { createUser, fetchUsers, setUserActive, updateUser, deleteUser } from '../api';

const roleOptions = ['student', 'teacher', 'staff', 'admin'] as const;

type Role = (typeof roleOptions)[number];

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: Role;
  department?: string | null;
  studentId?: string | null;
  phone?: string | null;
  is_active: 0 | 1 | boolean;
  created_at?: string;
};

type UserForm = {
  name: string;
  email: string;
  role: Role;
  department: string;
  studentId: string;
  phone: string;
  password?: string;
};

const emptyForm: UserForm = {
  name: '',
  email: '',
  role: 'student',
  department: '',
  studentId: '',
  phone: '',
  password: '',
};

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    const t = window.setInterval(loadUsers, 8000);
    return () => window.clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const activeText = u.is_active ? 'active' : 'inactive';
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        activeText.includes(q)
      );
    });
  }, [users, searchTerm]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setEditingUser(u);
    setForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role,
      department: (u.department as any) || '',
      studentId: (u.studentId as any) || '',
      phone: (u.phone as any) || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          department: form.department || null,
          studentId: form.studentId || null,
          phone: form.phone || null,
        });
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          role: form.role,
          department: form.department || null,
          studentId: form.studentId || null,
          phone: form.phone || null,
          password: form.password,
        });
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: UserRow) => {
    try {
      await setUserActive(u.id, !u.is_active);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: !u.is_active } : x)));
    } catch (err) {
      console.error(err);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (user: UserRow) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteUser(user.id);
      setUsers(users.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
            <p className="text-slate-500 text-sm">Create users, edit details, and enable/disable access.</p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create User</span>
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none transition-all text-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Info</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center space-x-1.5 font-bold text-sm ${u.is_active ? 'text-emerald-600' : 'text-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleActive(u)}
                            className={`p-2 transition-colors ${u.is_active ? 'text-slate-400 hover:text-red-500' : 'text-slate-400 hover:text-green-500'}`}
                            title={u.is_active ? 'Disable' : 'Enable'}
                          >
                            {u.is_active ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
            <div className="relative w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingUser ? 'Edit User' : 'Create User'}
                </h2>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                  {editingUser ? 'Update user details.' : 'Create a new user account.'}
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Role</label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 00000 00000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                      <input
                        value={form.department}
                        onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                        placeholder="e.g. Computer Science"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Student/Staff ID</label>
                      <input
                        value={form.studentId}
                        onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
                        placeholder="ID Number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                      <input
                        required
                        type="password"
                        value={form.password || ''}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersManagement;
