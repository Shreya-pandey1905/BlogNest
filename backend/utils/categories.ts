export type CategoryMeta = {
  name: string;
  emoji: string;
  color: string;
};

export const POPULAR_CATEGORIES: CategoryMeta[] = [
  { name: "Technology", emoji: "💻", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Design", emoji: "🎨", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Lifestyle", emoji: "☘️", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "Business", emoji: "📈", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { name: "Health", emoji: "🧘", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { name: "Travel", emoji: "✈️", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
];

export const DEFAULT_CATEGORY: CategoryMeta = {
  name: "Other",
  emoji: "📝",
  color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export function getCategoryMeta(name: string): CategoryMeta {
  const meta = POPULAR_CATEGORIES.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
  return meta || { ...DEFAULT_CATEGORY, name };
}
