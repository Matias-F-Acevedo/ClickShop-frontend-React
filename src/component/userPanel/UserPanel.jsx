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
    const [userImage, setUserImage] = useState('');

    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    const urlGetImage = "http://localhost:3000/api/users/"

    async function getUserImage(user_id) {
        const res = await fetch(`${urlGetImage}+${user_id}/profile-image`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return false;

        const parsed = await res.json()
        setUserImage(parsed)
        return parsed
    }


    useEffect(() => {
        if (user) {
            const capitalized = capitalizeFirstLetter(user.name) + " " + capitalizeFirstLetter(user.lastName)
            setCapitalizedNameLastname(capitalized);
            getUserImage(user.sub)
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


    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuUserPanel.current &&
                !menuUserPanel.current.contains(event.target) &&
                !event.target.classList.contains('icon-userProfile')
            ) {
                menuUserPanel.current.classList.remove("open-menu");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <img src={userImage.urlImage} />
                        <h3>{capitalizedNameLastname}</h3>
                    </div>
                    <hr />
                    <Link to={"/configuration-user"} onClick={toggleMenuUserPanel} className='sub-menu-link'>
                        <CgProfile className='icon-userPanel' />
                        <p>Editar perfil</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/"} onClick={toggleMenuUserPanel} className='sub-menu-link'>
                        <IoMdHeartEmpty className='icon-userPanel' />
                        <p>Favoritos</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/orders-user"} onClick={toggleMenuUserPanel} className='sub-menu-link'>
                        <TbShoppingBagCheck className='icon-userPanel' />
                        <p>Mis compras</p>
                        <span><IoIosArrowForward /></span>
                    </Link>
                    <Link to={"/publications-user"} onClick={toggleMenuUserPanel} className='sub-menu-link'>
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

