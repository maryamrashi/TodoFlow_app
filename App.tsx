import React, { useState, useMemo } from 'react';
import { Todo, Priority, FilterStatus, SortOption, Recurrence, Category } from './types';
import { useLocalStorage } from './components/useLocalStorage';
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
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-[#e5e7eb]">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter">
          Todo<span className="text-[#6366f1]">Flow</span>
        </h1>
        <p className="text-[#22d3ee] font-bold uppercase tracking-[0.3em] text-xs mb-8">
          Glass Dark Productivity
        </p>
      </header>

      {/* Quick Actions Bar */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
        <form onSubmit={handleQuickAdd} className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-96">
            <input 
              type="text"
              className="w-full glass bg-white/5 border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all text-white placeholder:text-slate-500 font-medium"
              placeholder="What needs to be done?..."
              value={quickTaskText}
              onChange={(e) => setQuickTaskText(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="glass bg-[#6366f1]/20 hover:bg-[#6366f1]/40 p-4 rounded-2xl border-white/10 transition-all text-[#22d3ee] active:scale-95"
            title="Add Task Immediately"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </form>

        <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="three-d-card bg-[#6366f1] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-[#4f46e5] transition-all flex items-center gap-3 active:scale-95 w-full md:w-auto justify-center"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass rounded-2xl p-6 text-center shadow-lg border-white/5">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Total Flow</p>
          <p className="text-3xl font-black text-white">{stats.total}</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center shadow-lg border-white/5">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Completed</p>
          <p className="text-3xl font-black text-[#22d3ee]">{stats.completed}</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center shadow-lg border-white/5">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">In Progress</p>
          <p className="text-3xl font-black text-[#6366f1]">{stats.pending}</p>
        </div>
      </div>

      {isFormOpen && <TodoForm onAdd={addTodo} onClose={() => setIsFormOpen(false)} />}

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              className="w-full glass bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#22d3ee]/50 transition-all text-base text-white font-medium"
              placeholder="Filter by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <div className="glass bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-all">
              <select 
                className="bg-transparent text-xs font-bold outline-none text-slate-400 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="All" className="bg-[#0f172a]">All Status</option>
                <option value="Active" className="bg-[#0f172a]">Active</option>
                <option value="Completed" className="bg-[#0f172a]">Completed</option>
              </select>
            </div>
            <div className="glass bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-all">
              <select 
                className="bg-transparent text-xs font-bold outline-none text-slate-400 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="Newest" className="bg-[#0f172a]">Sort: Newest</option>
                <option value="Oldest" className="bg-[#0f172a]">Sort: Oldest</option>
                <option value="Priority" className="bg-[#0f172a]">Sort: Priority</option>
                <option value="Due Date" className="bg-[#0f172a]">Sort: Due</option>
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
            <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-500">Your flow is empty</h3>
              <p className="text-slate-600 text-sm">Add a task to start your session.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="mt-24 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] pb-12 opacity-50">
        TodoFlow &bull; Glass Dark Productivity v1.0
      </footer>
    </div>
  );
};

export default App;