import "./navbar.css"
import { IoIosMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { PiStorefrontLight } from "react-icons/pi";
import { TiMessage } from "react-icons/ti";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { useRef } from "react";
import { BsCart3 } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import UserPanel from "../userPanel/UserPanel";

function Navbar() {

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
                        <span className="logo-name">ClickShop</span>
                    </div>
                    <div className="nav-desktop">
                        <ul>
                            <li><Link to={"/"}>Inicio</Link> </li>
                            <li><Link to={"/store"}>Tienda</Link> </li>
                            <li><Link to={"/contact"}>Contacto</Link> </li>
                            <li><Link to={"/team"}>Nosotros</Link> </li>
                            <li><Link to={"/sell"}>Vender</Link> </li>
                        </ul>
                    </div>
                    <div className="icon-nav">
                        <UserPanel className="icon-userProfile" />
                       <Link to={"/cart"}><BsCart3 className=" icon-cart" /></Link>

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
                                <Link to={"/"} className="nav-link">
                                    <GoHome className="icon" />
                                    <span className="link">Inicio</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/store"} className="nav-link">
                                    <PiStorefrontLight className="icon" />
                                    <span className="link">Tienda</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/"} className="nav-link">
                                    <IoMdHeartEmpty className="icon" />
                                    <span className="link">Favoritos</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/Contact"} className="nav-link">
                                    <TiMessage className="icon" />
                                    <span className="link">Contacto</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/team"} className="nav-link">
                                    <HiOutlineUserGroup className="icon" />
                                    <span className="link">Nosotros</span>
                                </Link>
                            </li>


                        </ul>

                        <div className="bottom-content">
                            <li className="list">
                                <Link to={"/"} className="nav-link">
                                    <GoHome className="icon" />
                                    <span className="link">Configuración</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to={"/"} className="nav-link">
                                    <GoHome className="icon" />
                                    <span className="link">Cerrar sesión</span>
                                </Link>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>

            <section onClick={() => closeToggleMenu()} className="overlay"></section>
        </header >
    )
}

export default Navbar