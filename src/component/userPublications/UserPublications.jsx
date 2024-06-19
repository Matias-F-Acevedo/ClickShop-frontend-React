import React from 'react'
import "./userPublication.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';
import { CgDetailsMore } from "react-icons/cg";
import { MdEditNote } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function UserPublications() {

    const { user, handleLogout } = useContext(UserContext);
    const [publications, setPublications] = useState([])

    async function getPublications() {

        const res = await fetch(`http://localhost:3000/api/products?userId=${user.sub}`)

        if (!res.ok) {
            console.log("no hay productos");
            return
        }

        const parsed = await res.json();
        setPublications(parsed);
    }

    async function deletePublication(productId) {


        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
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
                    const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
                        method: 'DELETE',
                    });
                    if (!res.ok) {
                        throw new Error('No se pudo eliminar el producto');
                    }
                    setPublications(publications.filter(pub => pub.productId !== productId));

                    Swal.fire({
                        title: "Eliminado!",
                        text: "Su publicación ha sido eliminada.",
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

    const handleLinkClick = (event, productId) => {
        event.preventDefault();
        const url = `/product/${productId}`;
        window.open(url, '_blank');
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const columns = [
        {
            header: "#",
            accessorKey: "productId",
        },
        {
            header: "Nombre",
            accessorKey: "product_name",

        },
        {
            header: "Stock",
            accessorKey: "stock",

        },
        {
            header: "Precio",
            accessorKey: "price",
            cell: info => {
                const value = parseFloat(info.getValue());
                const formattedValue = `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                return formattedValue;
            }
        },
        {
            header: "Descripción",
            accessorKey: "description",
            cell: info => {
                const description = info.getValue();
                return <div>{truncateText(description, 10)}</div>;
            }

        },
        {
            header: "Condición",
            accessorKey: "condition",
            cell: info => {
                const value = info.getValue();
                let classList = ""
                if (value === "NEW") classList = "NUEVO";
                if (value === "USED") classList = "USADO";

                return <div id={classList}>{classList}</div>;
            }

        },
        {
            header: "Fecha de creación",
            accessorKey: "createdAt",

            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        },
        {
            header: "Configuración",
            cell: ({ row }) => {
                const productId = row.original.productId;
                return <div className='crud-publicationsUser'>
                    <Link onClick={(event) => handleLinkClick(event, productId)}><CgDetailsMore className='btn-Details-publicationUser  btn-publicationUser' />
                    </Link>
                
                        <MdEditNote className='btn-Edit-publicationUser btn-publicationUser' />
                    <MdOutlineDeleteForever onClick={() => deletePublication(productId)} className='btn-delete-publicationUser btn-publicationUser' />
                </div>;
            }
        }
    ]


    useEffect(() => {
        getPublications()
    }, [user]);


    return (
        <TableComponent data={publications} columns={columns}></TableComponent>
    )
}

export default UserPublications;