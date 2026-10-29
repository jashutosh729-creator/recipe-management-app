import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { useRecipes } from '../context/RecipeContext';

export default function AddRecipe() { const { addRecipe } = useRecipes(); const navigate = useNavigate(); return <main className="page-shell form-page"><div className="page-intro"><p className="eyebrow">ADD SOMETHING DELICIOUS</p><h1>Share a recipe <em>with your future self.</em></h1><p>Save the ingredients and steps so your next cooking session is easy.</p></div><RecipeForm onSave={(data) => { const recipe = addRecipe(data); navigate(`/recipes/${recipe.id}`, { state: { toast: 'Recipe saved to your recipe box.' } }); }} /></main>; }
