import React, { useContext, useState, useEffect } from 'react';
import './sales.css';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';
import { UserContext } from '../../context/UserContext';

function Sales() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMap, setStatusMap] = useState({});



    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`http://localhost:3000/api/order/product-owner/${user.sub}`);
                if (!res.ok) throw new Error('Error fetching data');
                const data = await res.json();
                // Mapear sobre cada orden y sus detalles
                const promises = data.map(async (order) => {
                    const detailPromises = order.orderDetail.map(async (detail) => {
                        // Si hay una imagen de producto
                        if (detail.product && detail.product.product_image) {
                            const res = await fetch(`http://localhost:3000/api/products/${detail.product_id}/images`);

                            if (!res.ok) throw new Error('Error posting data');
                            const responseData = await res.json();
                            detail.product.product_image = responseData.urlImage[0]
                        }
                    });
                    return Promise.all(detailPromises);
                });

                await Promise.all(promises);
                const initialStatusMap = {};
                data.forEach(order => {
                    initialStatusMap[order.order_id] = order.status;
                });

                setOrders(data);
                setStatusMap(initialStatusMap);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
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


        console.log(newStatus, currentStatus);

        if (newStatus === undefined || newStatus === currentStatus) {
            alert("El estado seleccionado es el mismo que el estado actual del pedido o no ha sido cambiado.");
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/api/order/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                throw new Error('Error al enviar la petición');
            }
            setIsLoading(false);
            alert("Petición enviada con éxito");
        } catch (error) {
            console.error("Error al enviar la petición:", error);
            setIsLoading(false);
            alert("Hubo un error al enviar la petición");
        }
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
                        <div key={index} className='details-order'>
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
                    <div>
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