import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { fetchSettings, updateSettings } from '../api';

type Settings = {
  canteen_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
};

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Settings>({
    canteen_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSettings();
      setForm({
        canteen_name: data?.canteen_name || '',
        contact_email: data?.contact_email || '',
        contact_phone: data?.contact_phone || '',
        address: data?.address || '',
      });
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      await load();
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage canteen details used across the system.</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
          ) : (
            <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Canteen Name</label>
                  <input
                    required
                    value={form.canteen_name}
                    onChange={(e) => setForm((p) => ({ ...p, canteen_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm((p) => ({ ...p, contact_email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone</label>
                  <input
                    value={form.contact_phone}
                    onChange={(e) => setForm((p) => ({ ...p, contact_phone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm transition-all text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Physical Address</label>
                <textarea
                  rows={4}
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm transition-all text-slate-900 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-colors shadow-sm flex items-center space-x-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
