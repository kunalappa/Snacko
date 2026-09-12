import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../api';

const ManageCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [form, setForm] = useState({ name: '', icon: '' });

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const openCreate = () => {
        setEditingCategory(null);
        setForm({ name: '', icon: '' });
        setIsModalOpen(true);
    };

    const openEdit = (category: any) => {
        setEditingCategory(category);
        setForm({ name: category.name, icon: category.icon || '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, form);
            } else {
                await addCategory(form);
            }
            setIsModalOpen(false);
            await loadCategories();
        } catch (error: any) {
            alert(error.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure? This will fail if food items are using this category.')) {
            try {
                await deleteCategory(id);
                await loadCategories();
            } catch (error: any) {
                alert(error.message || 'Failed to delete category');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-grow p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link to="/admin/menu" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-2 transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Menu</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
                        <p className="text-slate-500 text-sm">Define food categories and icons.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>New Category</span>
                    </button>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <Loader2 className="animate-spin text-orange-500" size={32} />
                        </div>
                    ) : (
                        categories.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                                            {c.icon || <LayoutGrid className="text-slate-300" size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 truncate">{c.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {c.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(c)} className="p-2 text-slate-400 hover:text-orange-600 transition-colors" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
                        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingCategory ? 'Edit Category' : 'New Category'}
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm font-medium">Define details and save.</p>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Name</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Snacks"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-sm transition-all text-slate-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Icon (Emoji)</label>
                                        <input
                                            value={form.icon}
                                            onChange={(e) => setForm(p => ({ ...p, icon: e.target.value }))}
                                            placeholder="e.g. 🍕"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none text-xl text-center transition-all text-slate-900"
                                        />
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
                                            {saving ? 'Saving...' : 'Save Category'}
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

export default ManageCategories;
