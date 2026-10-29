import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid';
import { useRecipes } from '../context/RecipeContext';
import { recipeApi } from '../services/recipeApi';

export default function Explore() {
  const { sampleRecipes, userRecipes } = useRecipes(); const location = useLocation(); const navigate = useNavigate();
  const params = new URLSearchParams(location.search); const [query, setQuery] = useState(params.get('q') || ''); const [category, setCategory] = useState(params.get('category') || '');
  const [apiRecipes, setApiRecipes] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [sort, setSort] = useState('featured'); const requestId = useRef(0);
  const load = useCallback(async () => {
    const current = ++requestId.current; setLoading(true); setError('');
    try {
      const result = category && category !== 'Vegetarian' && category !== 'Quick Meals'
        ? await recipeApi.byCategory(category)
        : query
          ? await recipeApi.search(query)
          : category
            ? []
            : await recipeApi.byLetter('a');
      if (current === requestId.current) setApiRecipes(result);
    } catch (e) { if (current === requestId.current) { setError(e.message); setApiRecipes([]); } }
    finally { if (current === requestId.current) setLoading(false); }
  }, [category, query]);
  useEffect(() => { const timer = setTimeout(load, query ? 350 : 0); return () => clearTimeout(timer); }, [load, query]);
  const results = useMemo(() => { const matchesQuery = (recipe) => !query || [recipe.title, recipe.description, recipe.cuisine, ...(recipe.ingredients || []).map((ingredient) => ingredient.name)].some((value) => value?.toLowerCase().includes(query.toLowerCase())); const matchesCategory = (recipe) => !category || recipe.category === category || (category === 'Vegetarian' && recipe.tags?.includes('vegetarian')) || (category === 'Quick Meals' && recipe.tags?.includes('quick')); const locals = [...userRecipes, ...sampleRecipes].filter((recipe) => matchesQuery(recipe) && matchesCategory(recipe)); const combined = [...locals, ...apiRecipes.filter((recipe) => matchesQuery(recipe) && !locals.some((local) => local.title === recipe.title))]; return sort === 'az' ? combined.sort((a, b) => a.title.localeCompare(b.title)) : combined; }, [apiRecipes, sampleRecipes, userRecipes, query, category, sort]);
  const search = (event) => { event.preventDefault(); navigate(`/recipes${query ? `?q=${encodeURIComponent(query)}` : ''}${category ? `${query ? '&' : '?'}category=${encodeURIComponent(category)}` : ''}`); };
  return <main className="page-shell"><div className="page-intro"><p className="eyebrow">A WORLD OF GOOD THINGS</p><h1>Find your next <em>favorite.</em></h1><p>Browse the recipe box or discover something new from kitchens around the world.</p></div><section className="explore-tools"><form className="search-control" onSubmit={search}><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes, ingredients..." aria-label="Search recipes" /><button aria-label="Search">→</button></form><label className="select-label"><span className="sr-only">Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{['Breakfast','Lunch','Dinner','Dessert','Vegetarian','Quick Meals'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-label"><span className="sr-only">Sort recipes</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="az">A to Z</option></select></label><button className="clear-button" onClick={() => { setQuery(''); setCategory(''); navigate('/recipes'); }}>Clear filters</button></section><div className="results-line"><span>{loading ? 'Finding something delicious…' : `${results.length} recipes to explore`}</span>{error && <span className="api-note">Local recipes are available while the recipe service is offline.</span>}</div>{loading ? <div className="loading-state"><span className="loader"/> Looking for good things…</div> : <RecipeGrid recipes={results} emptyTitle="No recipes found" emptyText="Try another name or clear your filters." />}{error && <div className="error-banner" role="alert"><span>{error}</span><button className="button button-secondary" onClick={load}>Try again</button></div>}<p className="source-note">Your saved recipes stay in your recipe box. Discoveries from TheMealDB are labeled separately and load when available.</p></main>;
}
