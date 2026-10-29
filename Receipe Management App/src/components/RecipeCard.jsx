import { Link } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';

export default function RecipeCard({ recipe }) {
  const { favorites, toggleFavorite } = useRecipes();
  return <article className="recipe-card"><Link to={`/recipes/${recipe.id}`} className="card-image-link"><img className="card-image" src={recipe.image} alt={recipe.title} loading="lazy" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80'; }} /><span className="card-category">{recipe.category}</span></Link><button className={`favorite-button ${favorites.includes(recipe.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(recipe)} aria-label={`${favorites.includes(recipe.id) ? 'Remove' : 'Add'} ${recipe.title} ${favorites.includes(recipe.id) ? 'from' : 'to'} favorites`} aria-pressed={favorites.includes(recipe.id)}>♥</button><div className="card-content"><div className="card-meta"><span>{recipe.cuisine || 'Kitchen favorite'}</span><span>·</span><span>{recipe.prepTime || 15} min prep</span></div><Link to={`/recipes/${recipe.id}`} className="card-title">{recipe.title}</Link><div className="card-bottom"><span>◷ {Number(recipe.prepTime || 0) + Number(recipe.cookTime || 0)} min</span><span>{recipe.difficulty || 'Easy'}</span></div></div></article>;
}
