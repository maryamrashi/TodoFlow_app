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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div 
        className="glass w-full max-w-2xl rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-3xl animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-white">Create task</h2>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#22d3ee] uppercase tracking-[0.2em] ml-1">Task Name</label>
            <input
              autoFocus
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all text-white placeholder:text-slate-700 font-bold"
              placeholder="What's next?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all text-white placeholder:text-slate-700 font-medium min-h-[100px] resize-none"
              placeholder="Add some depth to this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs outline-none text-slate-300 font-bold cursor-pointer hover:bg-white/10 transition-all"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {Object.values(Priority).map(p => <option key={p} value={p} className="bg-[#0f172a]">{p}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs outline-none text-slate-300 font-bold cursor-pointer hover:bg-white/10 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map(c => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Repeat</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs outline-none text-slate-300 font-bold cursor-pointer hover:bg-white/10 transition-all"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
              >
                {Object.values(Recurrence).map(r => <option key={r} value={r} className="bg-[#0f172a]">{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
              <input 
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs outline-none text-slate-300 font-bold cursor-pointer hover:bg-white/10 transition-all"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 glass bg-white/5 text-slate-500 font-bold py-4 rounded-2xl hover:text-white transition-all active:scale-95 border-none"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-[#6366f1] text-white font-black py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:bg-[#4f46e5] transition-all active:scale-95"
            >
              Add Focus Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};