
import { Priority, Category } from './types';

export const PRIORITY_COLORS = {
  [Priority.LOW]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  [Priority.MEDIUM]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [Priority.HIGH]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const CATEGORY_ICONS = {
  [Category.WORK]: '💼',
  [Category.PERSONAL]: '🏠',
  [Category.SHOPPING]: '🛒',
  [Category.HEALTH]: '🧘',
  [Category.OTHER]: '✨',
};

export const STORAGE_KEY = 'todoflow_v1_data';
