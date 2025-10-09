import { Svgs } from './Svg'
import { Link } from 'react-router-dom'


export function NavBar() {
    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to="/" className="logo-text">Logo</Link>
            </div>

            <ul className="navbar-list">
                <li>
                    <Link to="/">
                        {Svgs.home}
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        {Svgs.profile}
                        <span>Profile</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
