const BASE = 'https://www.themealdb.com/api/json/v1/1';
const cache = new Map();

function transform(meal) {
  const ingredients = Array.from({ length: 20 }, (_, index) => ({
    name: meal[`strIngredient${index + 1}`]?.trim(),
    quantity: meal[`strMeasure${index + 1}`]?.trim(),
  })).filter((item) => item.name);
  const instructions = (meal.strInstructions || '').split(/\r?\n|(?<=[.!?])\s+(?=[A-Z])/).map((step) => step.trim()).filter(Boolean);
  return {
    id: `meal-${meal.idMeal}`, title: meal.strMeal, description: meal.strTags || `A much-loved ${meal.strArea || ''} recipe.`.trim(),
    image: meal.strMealThumb, category: meal.strCategory || 'Dinner', cuisine: meal.strArea || 'International',
    prepTime: 15, cookTime: 30, servings: 2, difficulty: 'Easy', ingredients, instructions,
    tags: meal.strTags ? meal.strTags.split(',').map((tag) => tag.trim()) : [], source: 'api', sourceUrl: meal.strSource,
  };
}

async function request(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) throw new Error('The recipe service is having a moment. Please try again.');
  const data = await response.json();
  cache.set(path, data);
  return data;
}

export const recipeApi = {
  async search(term) {
    const data = await request(`/search.php?s=${encodeURIComponent(term)}`);
    return (data.meals || []).map(transform);
  },
  async byLetter(letter) {
    const data = await request(`/search.php?f=${encodeURIComponent(letter)}`);
    return (data.meals || []).map(transform);
  },
  async details(id) {
    const data = await request(`/lookup.php?i=${encodeURIComponent(id.replace(/^meal-/, ''))}`);
    return data.meals?.[0] ? transform(data.meals[0]) : null;
  },
  async categories() {
    const data = await request('/categories.php');
    return data.categories || [];
  },
  async byCategory(category) {
    const data = await request(`/filter.php?c=${encodeURIComponent(category)}`);
    return (data.meals || []).map((meal) => ({
      id: `meal-${meal.idMeal}`, title: meal.strMeal, description: `A delicious ${category.toLowerCase()} recipe.`,
      image: meal.strMealThumb, category, cuisine: 'International', prepTime: 15, cookTime: 30,
      servings: 2, difficulty: 'Easy', ingredients: [], instructions: [], tags: [], source: 'api',
    }));
  },
};

export { transform as transformMeal };
