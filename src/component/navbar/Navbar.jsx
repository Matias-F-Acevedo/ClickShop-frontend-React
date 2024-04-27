import "./navbar.css"
import { Link } from "react-router-dom"
import { IoMdMenu } from "react-icons/io";
import { useRef, useEffect, useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";
import { UserContext } from '../../context/UserContext';

function Navbar() {

    const { user, handleLogout } = useContext(UserContext);

    const menulist = useRef();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menulist.current) {
            menulist.current.style.maxHeight = "0px";
        }
    }, []);

    function toggleMenu() {
        if (menulist.current.style.maxHeight == "0px") {
            menulist.current.style.maxHeight = "300px"
            setMenuOpen(true);
        } else {
            menulist.current.style.maxHeight = "0px"
            setMenuOpen(false);
        }
    }

    return (
        <header className="header">
            <nav className="nav">
                <div className="logo">
                    <Link to={"/"}><h1>ClickShop</h1></Link>
                </div>


                <ul ref={menulist} className="nav-links">
                    <li onClick={toggleMenu}><Link to={"/"}>Inicio</Link></li>
                    <li onClick={toggleMenu}><Link to={"/store"}>Tienda</Link></li>
                    <li onClick={toggleMenu}><Link to={"/contact"}>Contacto</Link></li>
                    <li onClick={toggleMenu}><Link to={"/team"}>Nosotros</Link></li>
                    <li className="login-button">
                        {user ?

                            <Link onClick={handleLogout} to={"/login"}>Logout< FaArrowRight className="arrow-login" /></Link>
                            :
                            <Link onClick={toggleMenu} to={"/login"}>Login < FaArrowRight className="arrow-login" /></Link>
                        }
                    </li>
                </ul>
                <div className="menu-icon">

                    {menuOpen ? (
                        <IoMdClose className="menu-close" onClick={toggleMenu} />
                    ) : (
                        <IoMdMenu className="menu-open" onClick={toggleMenu}></IoMdMenu>
                    )}

                </div>
            </nav>
        </header >
    )
}

export default Navbar