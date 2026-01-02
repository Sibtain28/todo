import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, Trash2, Edit2, LogOut, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleEdit = (task) => {
        setFormData({ title: task.title, description: task.description, status: task.status, priority: task.priority });
        setEditingId(task.id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/tasks/${editingId}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
            fetchTasks();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'LOW': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-400';
        }
    };

    const StatusColumn = ({ status, icon: Icon, title }) => (
        <div className="flex-1 min-w-[300px] bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 opacity-70" /> {title}
                <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full ml-auto">{tasks.filter(t => t.status === status).length}</span>
            </h2>
            <div className="space-y-3">
                {tasks.filter(t => t.status === status).map(t => (
                    <div key={t.id} className="bg-black/40 border border-white/5 p-4 rounded-lg hover:border-indigo-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">{t.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{t.description}</p>
                        <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                            <span className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(t)} className="p-1 hover:text-indigo-400"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(t.id)} className="p-1 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <nav className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md sticky top-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                        <CheckCircle2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">TaskFlow</h1>
                        <p className="text-xs text-gray-400">Professional Workspace</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
                            setIsFormOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Task
                    </button>
                    <div className="h-6 w-px bg-white/10" />
                    <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            <div className="flex overflow-x-auto gap-6 pb-6">
                <StatusColumn status="TODO" icon={Circle} title="To Do" />
                <StatusColumn status="IN_PROGRESS" icon={Clock} title="In Progress" />
                <StatusColumn status="DONE" icon={CheckCircle2} title="Completed" />
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Task' : 'Create New Task'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Title</label>
                                <input
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="e.g., Review PR #123"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Status</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-semibold">Priority</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Description</label>
                                <textarea
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white mt-1 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add details..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">
                                    {editingId ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
