import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, Loader2, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchMenu, deleteMenuItem, addMenuItem, updateMenuItem, fetchCategories } from '../api';

const ManageMenu: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<any>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    prep_time: '',
    is_available: true,
  });

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await fetchMenu();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    loadMenu();
    loadCategories();
    const t = window.setInterval(loadMenu, 8000);
    return () => window.clearInterval(t);
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category_id: categories?.[0]?.id || '',
      image_url: '',
      prep_time: '',
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setSelectedFile(null);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      category_id: item.category_id ?? '',
      image_url: item.image_url || '',
      prep_time: item.prep_time || '',
      is_available: !!item.is_available,
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
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', String(form.price));
      formData.append('category_id', form.category_id ? String(form.category_id) : '');
      formData.append('prep_time', form.prep_time);
      formData.append('is_available', String(form.is_available));
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        formData.append('image_url', form.image_url);
      }

      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await addMenuItem(formData);
      }
      setIsModalOpen(false);
      await loadMenu();
    } catch (error) {
      console.error(error);
      alert('Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesText = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      item.category === selectedCategory ||
      String(item.category_id) === String(selectedCategory);
    return matchesText && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-6 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Menu</h1>
            <p className="text-slate-500 text-sm">Add, edit, or remove items from your digital menu.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/categories"
              className="px-5 py-2.5 bg-white text-orange-600 border border-orange-300 font-bold rounded hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <LayoutGrid size={18} />
              <span>Categories</span>
            </Link>
            <button
              onClick={openCreate}
              className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add Item</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none transition-all text-slate-900 text-sm"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2.5 bg-slate-50 text-slate-500 rounded border border-slate-200 hover:bg-slate-100 transition-colors">
                <Filter size={20} />
              </button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-slate-600 font-bold focus:border-orange-500 focus:bg-white outline-none text-sm"
              >
                <option value="All Categories">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
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
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={item.image_url || 'https://via.placeholder.com/150'} alt="" className="w-12 h-12 rounded border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.prep_time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center space-x-1.5 font-bold text-sm ${item.is_available ? 'text-emerald-600' : 'text-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
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
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                <p className="text-slate-500 mt-1 text-sm font-medium">Fill details and save.</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((p: any) => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Price</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm((p: any) => ({ ...p, price: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                      <select
                        value={form.category_id}
                        onChange={(e) => setForm((p: any) => ({ ...p, category_id: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      >
                        <option value="">No Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Prep Time</label>
                      <input
                        value={form.prep_time}
                        onChange={(e) => setForm((p: any) => ({ ...p, prep_time: e.target.value }))}
                        placeholder="15 min"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Image</label>
                    <div className="flex items-center gap-4">
                      {form.image_url && !selectedFile && (
                        <img 
                          src={form.image_url} 
                          alt="Current" 
                          className="w-12 h-12 rounded border border-slate-200 object-cover" 
                        />
                      )}
                      {selectedFile && (
                        <div className="w-12 h-12 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-[10px] text-center p-1">
                          New Image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="flex-grow text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm((p: any) => ({ ...p, description: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="is_available"
                      type="checkbox"
                      checked={!!form.is_available}
                      onChange={(e) => setForm((p: any) => ({ ...p, is_available: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="is_available" className="text-sm font-bold text-gray-700">
                      Available
                    </label>
                  </div>

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

export default ManageMenu;
