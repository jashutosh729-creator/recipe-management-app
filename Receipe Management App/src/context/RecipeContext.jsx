/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import sampleRecipes from '../data/recipes.json';

const RecipeContext = createContext(null);
const KEYS = { users: 'recipehub_user_recipes_v1', favorites: 'recipehub_favorites_v1', recent: 'recipehub_recent_v1' };
function read(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function readList(key) { const value = read(key, []); return Array.isArray(value) ? value : []; }
function write(key, value) { try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable or full; keep the in-memory app usable. */ } }

export function RecipeProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(() => readList(KEYS.users).filter((recipe) => recipe && typeof recipe === 'object' && typeof recipe.id === 'string' && typeof recipe.title === 'string'));
  const [favorites, setFavorites] = useState(() => [...new Set(readList(KEYS.favorites).filter((id) => typeof id === 'string'))]);
  const [recent, setRecent] = useState(() => readList(KEYS.recent).filter((id) => typeof id === 'string'));
  const [favoriteMeta, setFavoriteMeta] = useState(() => { const value = read('recipehub_favorite_meta_v1', {}); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; });
  useEffect(() => { write(KEYS.users, userRecipes); }, [userRecipes]);
  useEffect(() => { write(KEYS.favorites, favorites); }, [favorites]);
  useEffect(() => { write(KEYS.recent, recent); }, [recent]);
  useEffect(() => { write('recipehub_favorite_meta_v1', favoriteMeta); }, [favoriteMeta]);
  const addRecipe = (recipe) => { const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`; const saved = { ...recipe, id: `user-${id}`, createdAt: new Date().toISOString() }; setUserRecipes((all) => [saved, ...all]); return saved; };
  const updateRecipe = (recipe) => setUserRecipes((all) => all.map((item) => item.id === recipe.id ? { ...item, ...recipe } : item));
  const deleteRecipe = (id) => { setUserRecipes((all) => all.filter((item) => item.id !== id)); setFavorites((all) => all.filter((item) => item !== id)); setRecent((all) => all.filter((item) => item !== id)); };
  const toggleFavorite = (recipe) => {
    setFavorites((all) => all.includes(recipe.id) ? all.filter((id) => id !== recipe.id) : [...all, recipe.id]);
    setFavoriteMeta((all) => ({ ...all, [recipe.id]: { id: recipe.id, title: recipe.title, image: recipe.image, category: recipe.category, cuisine: recipe.cuisine, description: recipe.description, prepTime: recipe.prepTime, cookTime: recipe.cookTime, servings: recipe.servings, difficulty: recipe.difficulty, source: recipe.source } }));
  };
  const addRecent = useCallback((recipe) => setRecent((all) => [recipe.id, ...all.filter((id) => id !== recipe.id)].slice(0, 8)), []);
  const value = useMemo(() => ({ userRecipes, favorites, recent, favoriteMeta, sampleRecipes, addRecipe, updateRecipe, deleteRecipe, toggleFavorite, addRecent }), [userRecipes, favorites, recent, favoriteMeta, addRecent]);
  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipes() { const context = useContext(RecipeContext); if (!context) throw new Error('useRecipes must be used within RecipeProvider'); return context; }
