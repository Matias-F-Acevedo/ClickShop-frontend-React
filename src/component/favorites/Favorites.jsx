import React from 'react'
import "./favorites.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import TableComponent from '../tableComponent/TableComponent';
import { MdOutlineDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { CgDetailsMore } from "react-icons/cg";
import { Link } from 'react-router-dom';

function Favorites() {

    const { user, handleLogout } = useContext(UserContext);
    const [favorites, setFavorites] = useState([])
    const navigate = useNavigate();
    async function getFavorites() {
        try {
            const res = await fetch(`http://localhost:3000/api/favorites/${user.sub}`);
            if (!res.ok) {
                throw new Error('Failed to fetch favorites');
            }
            const parsed = await res.json();
            setFavorites(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleLinkClick = (event, productId) => {
        event.preventDefault();
        const url = `/product/${productId}`;
        window.open(url, '_blank');
    };


    async function removeFavorite(productId, event) {

        event.stopPropagation();
        Swal.fire({
            title: "¿Estás seguro?",
            // text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, eliminar",
            customClass: {
                title: 'swal2-title',
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:3000/api/favorites/${user.sub}/${productId}`, {
                        method: 'DELETE',
                    });
                    if (!res.ok) {
                        throw new Error('No se pudo eliminar el producto');
                    }
                    setFavorites(favorites.filter(pub => pub.product_id !== productId));

                    Swal.fire({
                        title: "Eliminado!",
                        text: "Su producto ha sido eliminado de favoritos.",
                        icon: "success",
                        confirmButtonColor: "#006d779a",
                    });

                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
                }

            }
        });

    }

    const columns = [
        {
            header: "#",
            cell: ({ row }) => {
                const productImg = row.original.product.product_image;
                return <div className='image-favorites'>
                    <img src={productImg} alt={`product${row.original.product.productId}`} />
                </div>;
            }
        },
        {
            header: "Nombre",
            accessorKey: "product.product_name",
        },

        {
            header: "Descripción",
            accessorKey: "product.description",
            cell: info => {
                const description = info.getValue();
                return <div className='div-description-favorites'>{truncateText(description, 150)}</div>;
            }
        },
        {
            header: "Precio",
            accessorKey: "product.price",
            cell: info => {
                const value = parseFloat(info.getValue());
                const formattedValue = `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                return formattedValue;
            }
        },
        {
            header: "Eliminar",
            cell: ({ row }) => {
                const productId = row.original.product_id;
                return <div className='crud-publicationsUser btn-delete-favorite' >
                    <Link onClick={(event) => handleLinkClick(event, productId)}><CgDetailsMore className='btn-Details-publicationUser  btn-publicationUser' />
                    </Link>
                    <MdOutlineDeleteForever onClick={(event) => removeFavorite(productId, event)} className='btn-delete-publicationUser btn-publicationUser' />
                </div>;
            }
        }
    ];

    const handleRowClick = (favorite) => {
        const productId = favorite.product_id
        navigate(`/product/${productId}`);
    };

    useEffect(() => {
        getFavorites()
    }, [user]);


    return (
        <TableComponent data={favorites} columns={columns} ></TableComponent>
    )
}

export default Favorites;