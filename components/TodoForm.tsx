import React, { useState } from 'react';
import { Priority, Category, Recurrence, Todo } from '../types';

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  onClose: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd, onClose }) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [recurrence, setRecurrence] = useState<Recurrence>(Recurrence.NONE);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({
      text,
      description,
      priority,
      category,
      recurrence,
      dueDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="three-d-card glass w-full max-w-2xl rounded-[1.5rem] p-6 md:p-10 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-white">Create Task</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-[#22d3ee] uppercase tracking-widest ml-1">Task Name</label>
            <input
              autoFocus
              type="text"
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all placeholder:text-slate-600 text-white font-bold shadow-inner"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-[#22d3ee] uppercase tracking-widest ml-1">Description</label>
            <textarea
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all placeholder:text-slate-600 text-white font-medium shadow-inner min-h-[120px] resize-none"
              placeholder="Add deeper context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
              <select 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold cursor-pointer hover:bg-slate-900/70 transition-all"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {Object.values(Priority).map(p => <option key={p} value={p} className="bg-[#0f172a]">{p}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold cursor-pointer hover:bg-slate-900/70 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map(c => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Recurrence</label>
              <select 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold cursor-pointer hover:bg-slate-900/70 transition-all"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
              >
                {Object.values(Recurrence).map(r => <option key={r} value={r} className="bg-[#0f172a]">{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
              <input 
                type="date"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold cursor-pointer hover:bg-slate-900/70 transition-all [color-scheme:dark]"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 text-slate-400 font-bold py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95 border border-white/5"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-[#6366f1] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#6366f1]/20 hover:bg-[#4f46e5] transition-all active:scale-95"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};