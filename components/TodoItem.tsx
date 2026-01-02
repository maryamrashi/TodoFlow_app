import React, { useState } from 'react';
import { Todo, Priority, Category, Recurrence } from '../types';
import { PRIORITY_COLORS, CATEGORY_ICONS } from '../constants';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText });
      setIsEditing(false);
    }
  };

  const isOverdue = new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !todo.completed;

  return (
    <div className={`three-d-card rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-300 ${todo.completed ? 'opacity-50 glass bg-white/5 border-white/5' : 'glass bg-white/[0.08] border-white/10 shadow-2xl shadow-black/20'}`}>
      <div className="flex items-start gap-4">
        <button 
          onClick={() => onToggle(todo.id)}
          className={`w-7 h-7 rounded-xl border-2 flex-shrink-0 flex items-center justify-center transition-all transform active:scale-90 mt-0.5 ${todo.completed ? 'bg-[#22d3ee] border-[#22d3ee]' : 'border-slate-600 bg-transparent hover:border-[#6366f1]'}`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-[#0f172a] animate-in zoom-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input 
              autoFocus
              className="w-full bg-transparent border-b-2 border-[#6366f1] py-1 outline-none text-white font-bold text-lg"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            />
          ) : (
            <>
              <h3 
                className={`text-lg font-bold transition-all truncate cursor-pointer hover:text-[#22d3ee] ${todo.completed ? 'line-through text-slate-600' : 'text-slate-100'}`} 
                onClick={() => setIsEditing(true)}
              >
                {todo.text}
              </h3>
              {todo.description && (
                <p className={`text-sm mt-1 line-clamp-2 ${todo.completed ? 'text-slate-700' : 'text-slate-400 font-medium'}`}>
                  {todo.description}
                </p>
              )}
            </>
          )}
        </div>

        <button 
          onClick={() => onDelete(todo.id)}
          className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${PRIORITY_COLORS[todo.priority]}`}>
          {todo.priority}
        </span>
        
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border border-white/5 bg-white/5 text-slate-400 flex items-center gap-1.5 tracking-widest uppercase">
          <span>{CATEGORY_ICONS[todo.category]}</span>
          {todo.category}
        </span>

        {todo.recurrence !== Recurrence.NONE && (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border border-[#22d3ee]/20 bg-[#22d3ee]/5 text-[#22d3ee] flex items-center gap-1.5 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {todo.recurrence}
          </span>
        )}

        <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${isOverdue ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(todo.dueDate).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
        </div>
      </div>
    </div>
  );
};