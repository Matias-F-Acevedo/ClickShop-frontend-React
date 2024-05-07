import "./navbar.css"
import { Link } from "react-router-dom"
import { IoMdMenu } from "react-icons/io";
import { useRef, useEffect, useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";
import { UserContext } from '../../context/UserContext';
import UserPanel from "../userPanel/UserPanel";

function Navbar() {

    const { user, handleLogout } = useContext(UserContext);

    const menulist = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    const yourDivRef = useRef();



    useEffect(() => {
        if (menulist.current) {
            menulist.current.style.maxHeight = "0px";
        }

        const handleClickOutside = (event) => {
            if (yourDivRef.current && !yourDivRef.current.contains(event.target)) {
                yourDivRef.current.classList.add('displayNone');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [yourDivRef]);



    function toggleMenu() {
        yourDivRef.current.classList.add('displayNone');
        if (menulist.current.style.maxHeight == "0px") {
            menulist.current.style.maxHeight = "300px"
            setMenuOpen(true);
        } else {
            menulist.current.style.maxHeight = "0px"
            setMenuOpen(false);
        }
    }

    function closePanelUser() {
        if (yourDivRef.current.classList.contains('displayNone')) {
            yourDivRef.current.classList.remove('displayNone');
        } else {
            yourDivRef.current.classList.add('displayNone');
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
                    {user ?
                    <li onClick={toggleMenu}><Link to={"/vender"}>Vender</Link></li>
:<></>}
                    <li onClick={toggleMenu}><Link to={"/contact"}>Contacto</Link></li>
                    <li onClick={toggleMenu}><Link to={"/team"}>Nosotros</Link></li>
                    <li className="login-button">
                        {user ?

                            <>
                    
                                <div className="photo-perfil-user" onClick={closePanelUser}>
                                <img src="src\component\configurationUser\user-icon.jpg" alt="user-photo"/>
                                </div>

                                <div ref={yourDivRef} className="displayNone">
                                    <UserPanel closePanelUser={closePanelUser}></UserPanel>
                                </div>
                            </>
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