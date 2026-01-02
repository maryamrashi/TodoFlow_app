import React, { useState, useMemo } from 'react';
import { Todo, Priority, FilterStatus, SortOption, Recurrence, Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY } from './constants';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';

const App: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [quickTaskText, setQuickTaskText] = useState('');

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    addTodo({
      text: quickTaskText,
      description: '',
      priority: Priority.MEDIUM,
      category: Category.OTHER,
      recurrence: Recurrence.NONE,
      dueDate: new Date().toISOString().split('T')[0]
    });
    setQuickTaskText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'All' || 
          (filterStatus === 'Completed' ? todo.completed : !todo.completed);
        const matchesPriority = filterPriority === 'All' || todo.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'Newest': return b.createdAt - a.createdAt;
          case 'Oldest': return a.createdAt - b.createdAt;
          case 'Due Date': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'Priority': {
            const weights = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
            return weights[b.priority] - weights[a.priority];
          }
          default: return 0;
        }
      });
  }, [todos, search, filterStatus, filterPriority, sortBy]);

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative text-[#e5e7eb]">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Todo<span className="text-[#6366f1]">Flow</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium">
          Calm, focused, and premium productivity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="three-d-card glass rounded-2xl p-6 text-center shadow-lg">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-widest">Total</p>
          <p className="text-3xl font-black text-white">{stats.total}</p>
        </div>
        <div className="three-d-card glass rounded-2xl p-6 text-center shadow-lg">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-widest">Completed</p>
          <p className="text-3xl font-black text-[#22d3ee]">{stats.completed}</p>
        </div>
        <div className="three-d-card glass rounded-2xl p-6 text-center shadow-lg">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-widest">Pending</p>
          <p className="text-3xl font-black text-[#6366f1]">{stats.pending}</p>
        </div>
      </div>

      <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
        <form onSubmit={handleQuickAdd} className="flex w-full md:w-auto items-center gap-2 group">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text"
              className="w-full glass bg-white/5 border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all text-white placeholder:text-slate-500 font-medium"
              placeholder="Quick add task..."
              value={quickTaskText}
              onChange={(e) => setQuickTaskText(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="hidden md:flex glass bg-white/5 hover:bg-white/10 p-4 rounded-2xl border-white/10 transition-all text-[#22d3ee] active:scale-95"
            title="Add Task Immediately"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </form>

        <span className="text-slate-600 font-bold hidden md:inline">OR</span>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="three-d-card bg-[#6366f1] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6366f1]/20 hover:bg-[#4f46e5] transition-all flex items-center gap-3 active:scale-95 w-full md:w-auto justify-center"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {isFormOpen && <TodoForm onAdd={addTodo} onClose={() => setIsFormOpen(false)} />}

      <section className="three-d-card glass rounded-[1.5rem] p-6 md:p-8 mb-8 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex flex-col gap-6 mb-10">
          <div className="relative w-full">
            <input 
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#22d3ee]/50 transition-all text-base text-white shadow-inner font-medium"
              placeholder="Search your workflow..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-900/40 rounded-xl border border-white/5 px-4 py-2 hover:bg-slate-900/60 transition-all">
              <select 
                className="bg-transparent text-sm font-bold outline-none text-slate-300 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="All" className="bg-[#0f172a]">Status: All</option>
                <option value="Active" className="bg-[#0f172a]">Active</option>
                <option value="Completed" className="bg-[#0f172a]">Completed</option>
              </select>
            </div>

            <div className="bg-slate-900/40 rounded-xl border border-white/5 px-4 py-2 hover:bg-slate-900/60 transition-all">
              <select 
                className="bg-transparent text-sm font-bold outline-none text-slate-300 cursor-pointer"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Priority | 'All')}
              >
                <option value="All" className="bg-[#0f172a]">Priority: All</option>
                {Object.values(Priority).map(p => <option key={p} value={p} className="bg-[#0f172a]">Priority: {p}</option>)}
              </select>
            </div>

            <div className="bg-slate-900/40 rounded-xl border border-white/5 px-4 py-2 hover:bg-slate-900/60 transition-all">
              <select 
                className="bg-transparent text-sm font-bold outline-none text-slate-300 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                {['Newest', 'Oldest', 'Priority', 'Due Date'].map(s => <option key={s} value={s} className="bg-[#0f172a]">Sort: {s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedTodos.length > 0 ? (
            filteredAndSortedTodos.map(todo => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-500">No tasks in view</h3>
              <p className="text-slate-600">Your workflow is clean and clear.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="mt-12 text-center text-slate-600 text-sm font-semibold tracking-widest uppercase">
        TodoFlow &bull; Powered by Glass Dark Productivity
      </footer>
    </div>
  );
};

export default App;