import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { RecipeProvider } from './context/RecipeContext';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import RecipeDetails from './pages/RecipeDetails';
import './App.css';

function Footer() { return <footer className="site-footer"><div className="footer-main"><Link to="/" className="brand"><span className="brand-mark">✿</span><span>recipe<span>book</span></span></Link><p>A little more delicious, every day.</p><nav><Link to="/recipes">Explore</Link><Link to="/my-recipes">My recipes</Link><Link to="/favorites">Favorites</Link><Link to="/add-recipe">Add a recipe</Link></nav></div><div className="footer-bottom"><span>© 2026 RecipeBook. Made with a little love.</span><span>Good things take thyme <b>✳</b></span></div></footer>; }
function NotFound() { return <main className="page-shell"><div className="empty-state"><span className="empty-icon">404</span><h2>This page wandered off</h2><p>Let’s get you back to something delicious.</p><Link to="/" className="button button-primary">Back home</Link></div></main>; }
export default function App() { return <BrowserRouter><RecipeProvider><div className="app-shell"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/recipes" element={<Explore/>}/><Route path="/recipes/:id" element={<RecipeDetails/>}/><Route path="/add-recipe" element={<AddRecipe/>}/><Route path="/edit-recipe/:id" element={<EditRecipe/>}/><Route path="/favorites" element={<Favorites/>}/><Route path="/my-recipes" element={<MyRecipes/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></div></RecipeProvider></BrowserRouter>; }
