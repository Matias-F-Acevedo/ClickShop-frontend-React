import React, { useContext, useState, useEffect } from 'react';
import './sales.css';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { getById,getAll,updatePatch } from '../../service/functionsHTTP';


function Sales() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMap, setStatusMap] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        if(user){

        
        async function fetchData() {
            try {
                const url =`http://localhost:3000/api/order/product-owner`;
                const res = await getById(user.sub,url,user.jwt)

                if (!res.ok) throw new Error('Error fetching data');
                const data = await res.json();
                // Mapear sobre cada orden y sus detalles
                const promises = await data.map(async (order) => {
                    const detailPromises = order.orderDetail.map(async (detail) => {
                        // Si hay una imagen de producto
                        if (detail.product && detail.product.product_image) {

                            const url = `http://localhost:3000/api/products/${detail.product_id}/images`;

                            const res = await getAll(url,user.jwt);
                            if (!res.ok) throw new Error('Error posting data');
                            const responseData = await res.json();
                            if (Array.isArray(responseData.urlImage)) {
                                detail.product.product_image = await responseData.urlImage[0];
                            } else {
                                // Si no es un array, asignar el valor directamente
                                detail.product.product_image = await responseData.urlImage;
                            }
                        }
                    });
                    return Promise.all(detailPromises);
                });

                await Promise.all(promises);
                const initialStatusMap = {};
                data.forEach(order => {
                    initialStatusMap[order.order_id] = order.status;
                });
                
                const activeOrders = data.filter(order => 
                    order.orderDetail.every(detail => detail.product.isActive === true)
                );
                
                console.log(activeOrders);

                setOrders(data);
                setStatusMap(initialStatusMap);
            
            } catch (error) {
                console.log(error)
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }
    }, [user]);

    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }



    const handleChange = (orderId, event) => {
        const { value } = event.target;
        setStatusMap(prevStatusMap => ({
            ...prevStatusMap,
            [orderId]: value
        }));
    };

    const handleSubmit = async (orderId) => {
        const newStatus = statusMap[orderId];
        const currentStatus = orders.find(order => order.order_id === orderId).status;


        if (newStatus === undefined || newStatus === currentStatus) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'El estado seleccionado es el mismo que el estado actual del pedido o no ha sido cambiado.',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swal2-toast-custom'
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
            return;
        }
        try {
            setIsLoading(true);
            const fullUrl = `http://localhost:3000/api/order/${orderId}`;
            const body = { status: newStatus };

            const res = await updatePatch(fullUrl,body,user.jwt)
            
            if (!res.ok) {
                throw new Error('Error al enviar la petición');
            }
            
            setOrders(prevOrders => prevOrders.map(order => 
                order.order_id === orderId ? { ...order, status: newStatus } : order
            ));

            setIsLoading(false);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'El estado fue cambiado con éxito',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swal2-toast-custom'
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        } catch (error) {
            console.error("Error al enviar la petición:", error);
            setIsLoading(false);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Hubo un error al enviar la petición',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swal2-toast-custom'
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        }
    };

    const handleLinkClick = (productId) => {
        navigate(`/product/${productId}`);
      };
    

    const columns = [
        {
            header: "Fecha",
            accessorKey: "date",
            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        },
        {
            header: "Datos del comprador",
            accessorKey: "user",
            cell: info => (
            <div className='data-user-order'>
                <p><span>Nombre y apellido:</span> {`${capitalizeFirstLetter(info.getValue().user_name)} ${capitalizeFirstLetter(info.getValue().user_lastname)}`
                }.</p>
                <p><span>Dni:</span> {info.getValue().user_identificationNumber}.</p>
                <p><span>Teléfono:</span> {info.getValue().user_phoneNumber}.</p>
            </div>
            )
        },
        {
            header: "Dirección de entrega",
            accessorKey: "shippingAddress",
            cell: info => {
                const { shippingAddress, city, province } = info.row.original;
                return `${capitalizeFirstLetter(shippingAddress)}, ${capitalizeFirstLetter(city)}, ${capitalizeFirstLetter(province)}.`;
            },
        },

        {
            header: "Detalle del Pedido",
            accessorKey: "orderDetail",
            cell: info => (
                <div className='scrollable-container'>
                    {info.getValue().map((detail, index) => (
                        <div key={index} className='details-order' onClick={()=>handleLinkClick(detail.product_id)}>
                            <div className='container-img-details-order'>
                                <img src={detail.product.product_image} alt="Producto" />
                            </div>

                            <div>
                                <p>Producto: {detail.product.product_name}</p>
                                <p>Cantidad: {detail.quantity} uds.</p>
                            </div>

                        </div>
                    ))}
                </div>
            )
        },
        {
            header: "Total",
            accessorKey: "total",
            cell: info => {
                const value = parseFloat(info.getValue());
                const formattedValue = `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                return formattedValue;
            }
        },
        {
            header: "Estado",
            accessorKey: "status",
            cell: info => {
                const orderId = info.row.original.order_id;
                const currentStatus = info.getValue();
                const value = info.getValue();
                let className = "";

                const valueMap = statusMap[orderId] || currentStatus;

                if (value === "PENDING") className = "PENDIENTE";
                else if (value === "COMPLETED") className = "COMPLETADO";
                else if (value === "SHIPPED") className = "ENVIADO";
                else if (value === "CANCELLED") className = "CANCELADO";
                return (
                    <div className='sales-status-order'>
                        <div className='current-status'>Estado actual:<p id={className}>{className}</p></div>

                        <div className='container-select-status'>
                            <select value={valueMap} onChange={(event) => handleChange(orderId, event)}>
                                <option id='PENDIENTE' value="PENDING">PENDIENTE</option>
                                <option id='ENVIADO' value="SHIPPED">ENVIADO</option>
                                <option id='COMPLETADO' value="COMPLETED">COMPLETADO</option>
                                <option id='CANCELADO' value="CANCELLED">CANCELADO</option>
                            </select>
                            <button onClick={() => handleSubmit(orderId)} disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                );
            }
        },
    ];

    if (loading) return <div>Cargando...</div>;

    return (
        <TableComponent data={orders} columns={columns}></TableComponent>
    );
}

export default Sales;