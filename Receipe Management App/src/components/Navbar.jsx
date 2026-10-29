import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return <header className="site-header"><div className="nav-wrap"><Link to="/" className="brand" aria-label="RecipeBook home"><span className="brand-mark">✿</span><span>recipe<span>book</span></span></Link><nav className="main-nav" aria-label="Main navigation"><NavLink to="/recipes">Explore</NavLink><NavLink to="/my-recipes">My recipes</NavLink><NavLink to="/favorites">Favorites</NavLink></nav><Link className="button button-primary nav-add" to="/add-recipe"><span>＋</span> Add recipe</Link></div></header>;
}
