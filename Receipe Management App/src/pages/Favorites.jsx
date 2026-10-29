import RecipeGrid from '../components/RecipeGrid';
import { useRecipes } from '../context/RecipeContext';

export default function Favorites() { const { favorites, favoriteMeta, sampleRecipes, userRecipes } = useRecipes(); const all = [...userRecipes, ...sampleRecipes]; const recipes = favorites.map((id) => all.find((item) => item.id === id) || favoriteMeta[id]).filter(Boolean); return <main className="page-shell"><div className="page-intro"><p className="eyebrow">A FEW GOOD THINGS</p><h1>Your <em>favorites.</em></h1><p>All the recipes you’ve tucked away for another day.</p></div><RecipeGrid recipes={recipes} emptyTitle="No favorites saved yet" emptyText="Tap the heart on a recipe and it’ll be waiting here." /></main>; }
