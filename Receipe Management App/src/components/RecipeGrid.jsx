import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes, emptyTitle = 'Nothing simmering here yet', emptyText = 'Try changing your search or filters.' }) {
  if (!recipes.length) return <div className="empty-state"><span className="empty-icon">✳</span><h2>{emptyTitle}</h2><p>{emptyText}</p></div>;
  return <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>;
}
