import "./navbar.css"
import { IoIosMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { PiStorefrontLight } from "react-icons/pi";
import { TiMessage } from "react-icons/ti";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { useRef, useContext,useState} from "react";
import { BsCart3 } from "react-icons/bs";
import UserPanel from "../userPanel/UserPanel";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { UserContext } from '../../context/UserContext';
import { MdOutlineLogin } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
function Navbar() {
    const { cartQuantity } = useContext(CartContext);
    const { user, handleLogout } = useContext(UserContext);
    const navigate = useNavigate();
    const navbar = useRef();

    function toggleMenu() {
        navbar.current.classList.toggle('open');
    }

    function closeToggleMenu() {
        navbar.current.classList.remove('open');
    }


    return (
        <header>
            <nav ref={navbar}>


                <div className="container-nav-desktop">
                    <div className="logo">
                        <IoIosMenu onClick={() => toggleMenu()} className="menu-icon" />
                        <img src="src\assets\logo.png" alt="sdsd" onClick={() => navigate(`/`)} />
                        <span className="logo-name" onClick={() => navigate(`/`)}>ClickShop</span>

                    </div>
                    <div className="nav-desktop">
                        <ul>
                            <li><Link to={"/"}>Inicio</Link> </li>
                            <li><Link to={"/store"}>Tienda</Link> </li>
                            <li><Link to={"/contact"}>Contacto</Link> </li>
                            <li><Link to={"/team"}>Nosotros</Link> </li>

                            {user ?
                                <li><Link to={"/sell"}>Vender</Link> </li>
                                : <></>
                            }

                        </ul>
                    </div>
                    <div className="icon-nav">
                        <UserPanel className="icon-userProfile" />
                        {user ?
                            <>
                                <Link to={"/cart"}><BsCart3 className="icon-cart" /></Link>
                                <div className="container-cant-cart">
                                    <p className="cant-cart">{cartQuantity}</p>
                                </div>
                            </>
                            : <></>}
                    </div>
                </div>


                <div className="sidebar">
                    <div className="logo">
                        <IoIosMenu onClick={() => toggleMenu()} className="menu-icon" />
                        <span className="logo-name">ClickShop</span>
                    </div>
                    <div className="sidebar-content">
                        <ul className="lists">
                            <li className="list">
                                <Link to={"/"} className="nav-link" onClick={() => closeToggleMenu()}>
                                    <GoHome className="icon" />
                                    <span className="link">Inicio</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/store"} className="nav-link" onClick={() => closeToggleMenu()}>
                                    <PiStorefrontLight className="icon" />
                                    <span className="link">Tienda</span>
                                </Link>
                            </li>
                            {user ?
                                <li className="list">
                                    <Link to={"/favorites"} className="nav-link" onClick={() => closeToggleMenu()}>
                                        <IoMdHeartEmpty className="icon" />
                                        <span className="link">Favoritos</span>
                                    </Link>
                                </li>
                                : <></>}
                            <li className="list">
                                <Link to={"/Contact"} className="nav-link" onClick={() => closeToggleMenu()}>
                                    <TiMessage className="icon" />
                                    <span className="link">Contacto</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/team"} className="nav-link" onClick={() => closeToggleMenu()}>
                                    <HiOutlineUserGroup className="icon" />
                                    <span className="link">Nosotros</span>
                                </Link>
                            </li>


                        </ul>

                        <div className="bottom-content">

                            {user ?
                                <li className="list">
                                    <Link to={"/configuration-user"} className="nav-link" onClick={() => closeToggleMenu()}>
                                        <CiSettings className="icon" />
                                        <span className="link">Configuración</span>
                                    </Link>
                                </li>
                                : <></>}
                            {user ?
                                <li className="list">
                                    <Link to={"/"} className="nav-link" onClick={() => { handleLogout(), closeToggleMenu() }}>
                                        <MdOutlineLogout className="icon" />
                                        <span className="link">Cerrar sesión</span>
                                    </Link>
                                </li>
                                :

                                <li className="list">
                                    <Link to={"/login"} className="nav-link" onClick={() => closeToggleMenu()}>
                                        <MdOutlineLogin className="icon" />
                                        <span className="link">Iniciar sesión</span>
                                    </Link>
                                </li>
                            }



                        </div>
                    </div>
                </div>
            </nav>

            <section onClick={() => closeToggleMenu()} className="overlay"></section>
        </header >
    )
}

export default Navbar