import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { recipeApi } from '../services/recipeApi';

function scaleQuantity(value, ratio) {
  const match = String(value || '').match(/^\s*(\d+(?:\.\d+)?|\d+\/\d+)(.*)$/);
  if (!match) return value;
  const number = match[1].includes('/') ? match[1].split('/').reduce((a, b) => Number(a) / Number(b)) : Number(match[1]);
  const scaled = number * ratio; return `${Number.isInteger(scaled) ? scaled : Number(scaled.toFixed(2))}${match[2]}`;
}
export default function RecipeDetails() {
  const { id } = useParams(); const { sampleRecipes, userRecipes, favorites, toggleFavorite, addRecent } = useRecipes(); const [remoteState, setRemoteState] = useState(null); const [servingChoice, setServingChoice] = useState(null); const location = useLocation();
  const local = [...userRecipes, ...sampleRecipes].find((recipe) => recipe.id === id);
  useEffect(() => {
    if (!id?.startsWith('meal-')) return undefined;
    let active = true;
    recipeApi.details(id).then((recipe) => { if (active) setRemoteState({ id, recipe }); }).catch((error) => { if (active) setRemoteState({ id, error: error.message }); });
    return () => { active = false; };
  }, [id]);
  const remote = remoteState?.id === id ? remoteState : null;
  const recipe = local || remote?.recipe;
  const servings = servingChoice?.id === id ? servingChoice.value : recipe?.servings || 2;
  useEffect(() => { if (recipe) addRecent(recipe); }, [recipe, addRecent]);
  if (!recipe) return <main className="page-shell"><div className="empty-state detail-loading"><span className="empty-icon">{remote?.error ? '✳' : '…'}</span><h2>{remote?.error ? 'We couldn’t load this recipe' : id?.startsWith('meal-') ? 'Finding your recipe…' : 'We couldn’t find that recipe'}</h2><p>{remote?.error || 'It may have been removed from your recipe box.'}</p>{remote?.error && <button className="button button-secondary" onClick={() => setRemoteState(null)}>Try again</button>}<Link to="/recipes" className="text-link">Back to recipes →</Link></div></main>;
  const favorited = favorites.includes(recipe.id); const ingredients = recipe.ingredients || [];
  return <main className="page-shell detail-page">{location.state?.toast && <div className="toast-message" role="status">✓ {location.state.toast}</div>}<Link to="/recipes" className="back-link">← Back to recipes</Link><div className="detail-hero"><div className="detail-photo"><img src={recipe.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80'} alt={recipe.title}/></div><div className="detail-copy"><p className="eyebrow">{recipe.category} <span>·</span> {recipe.cuisine}</p><h1>{recipe.title}</h1><p className="detail-description">{recipe.description}</p><div className="detail-metrics"><div><span>PREP TIME</span><strong>{recipe.prepTime || 0} <small>min</small></strong></div><div><span>COOK TIME</span><strong>{recipe.cookTime || 0} <small>min</small></strong></div><div><span>SERVES</span><strong>{servings}</strong></div></div><div className="detail-actions"><button className={`button ${favorited ? 'button-favorite' : 'button-secondary'}`} onClick={() => toggleFavorite(recipe)}>{favorited ? '♥ Saved to favorites' : '♡ Save to favorites'}</button>{recipe.id.startsWith('user-') && <Link className="button button-light" to={`/edit-recipe/${recipe.id}`}>Edit recipe</Link>}</div>{remote?.error && <p className="api-note">Showing saved recipe details. {remote.error}</p>}</div></div><div className="detail-columns"><section className="ingredients-panel"><div className="detail-section-heading"><div><p className="eyebrow">WHAT YOU’LL NEED</p><h2>Ingredients</h2></div><label className="servings-control">Serves <button aria-label="Decrease servings" onClick={() => setServingChoice({ id, value: Math.max(1, servings - 1) })}>−</button><strong>{servings}</strong><button aria-label="Increase servings" onClick={() => setServingChoice({ id, value: servings + 1 })}>＋</button></label></div><ul className="ingredient-list">{ingredients.length ? ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`}><span>{ingredient.name}</span><strong>{scaleQuantity(ingredient.quantity, servings / (recipe.servings || 2)) || 'to taste'}</strong></li>) : <li>Ingredients are not available for this recipe yet.</li>}</ul></section><section className="instructions-panel"><p className="eyebrow">LET’S GET COOKING</p><h2>Method</h2><ol className="instruction-list">{recipe.instructions?.length ? recipe.instructions.map((step, index) => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>) : <li>Instructions are not available for this recipe yet.</li>}</ol></section></div></main>;
}
