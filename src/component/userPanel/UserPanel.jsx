import React from 'react'
import { useRef, useContext, useEffect, useState } from "react";
import "./userPanel.css"
import { Link } from "react-router-dom"
import { UserContext } from '../../context/UserContext';
import { IoIosArrowForward } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { TbShoppingBagCheck } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { BsPostcard } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

import { LiaUserPlusSolid } from "react-icons/lia";

import { PiUserCircle } from "react-icons/pi";
function UserPanel() {

    const { user, handleLogout } = useContext(UserContext);
    const [capitalizedNameLastname, setCapitalizedNameLastname] = useState('');

    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }


    useEffect(() => {
        if (user) {
            const capitalized = capitalizeFirstLetter(user.name) + " " + capitalizeFirstLetter(user.lastName)
            setCapitalizedNameLastname(capitalized);
        }
    }, [user]);


    const menuUserPanel = useRef();

    function toggleMenuUserPanel() {
        menuUserPanel.current.classList.toggle("open-menu")
    }

    function logOut() {
        toggleMenuUserPanel();
        handleLogout();
    }


    return (
        <>
            {
                user ?
                    <PiUserCircle className='icon-userProfile' onClick={() => toggleMenuUserPanel()}></PiUserCircle >
                    :
                    <Link to={"/login"} className='link-icon-userProfile'> <LiaUserPlusSolid className='icon-userProfile'></LiaUserPlusSolid ></Link>
            }



            <div ref={menuUserPanel} className='sub-menu-wrap'>
                <div className='sub-menu'>
                    <div className='user-info'>
                        <img src="src\component\configurationUser\user-icon.jpg" alt="user-photo" />
                        <h3>{capitalizedNameLastname}</h3>
                    </div>
                    <hr />
                    <Link to={"/configuration-user"} className='sub-menu-link'>
                        <CgProfile className='icon-userPanel' />
                        <p>Editar perfil</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/"} className='sub-menu-link'>
                        <IoMdHeartEmpty className='icon-userPanel' />
                        <p>Favoritos</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/"} className='sub-menu-link'>
                        <TbShoppingBagCheck className='icon-userPanel' />
                        <p>Mis compras</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/"} className='sub-menu-link'>
                        <BsPostcard className='icon-userPanel' />
                        <p>Mis publicaciones</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link onClick={() => logOut()} to={"/"} className='sub-menu-link'>
                        <MdOutlineLogout className='icon-userPanel' />
                        <p>Cerrar sesión</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default UserPanel;

