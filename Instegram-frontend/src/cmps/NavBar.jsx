import { Svgs } from './Svg'
import { Link } from 'react-router-dom'


export function NavBar() {

    return (
        <section className="navbar-container">
            <Link to="/" className="logo">Logo</Link>

            <ul id="navbar-list" className="right">
                <li>{Svgs.home}<Link to="/"> Home</Link></li>
                <li>{Svgs.profile}<Link to="#"> Profile</Link></li>
            </ul>
        </section>

    )
}