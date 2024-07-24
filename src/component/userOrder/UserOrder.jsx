import React from 'react'
import "./userOrder.css"
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import TableComponent from '../tableComponent/TableComponent';
import { getAll } from '../../service/functionsHTTP';


function UserOrder() {

    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([])

    async function getOrders() {
        try {
            const url = `http://localhost:3000/api/order?userId=${user.sub}`;
            const res = await getAll(url, user.jwt)

            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
            const parsed = await res.json();
            const promises = parsed.map(async (order) => {
                const detailPromises = order.orderDetail.map(async (detail) => {
                    if (detail.product && detail.product.product_image) {
                        const url = `http://localhost:3000/api/products/${detail.product_id}/images`;
                        const res = await getAll(url, user.jwt);
                        if (!res.ok) throw new Error('Error fetching image');
                        const responseData = await res.json();
                        if (Array.isArray(responseData.urlImage)) {
                            detail.product.product_image = responseData.urlImage[0];
                        } else {
                            detail.product.product_image = responseData.urlImage;
                        }
                    }
                });
                return Promise.all(detailPromises);
            });

            await Promise.all(promises);
            setOrders(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const columns = [
        {
            header: "Fecha",
            accessorKey: "date",
            cell: info => dayjs(info.getValue()).format("DD/MM/YYYY")
        },
        {
            header: "Dirección de entrega",
            accessorKey: "shippingAddress",
        },
        {
            header: "Detalles del Pedido",
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
                const value = info.getValue();
                let className = "";
                if (value === "PENDING") className = "PENDIENTE";
                else if (value === "COMPLETED") className = "COMPLETADO";
                else if (value === "SHIPPED") className = "ENVIADO";
                else if (value === "CANCELLED") className = "CANCELADO";

                return <div id={className}>{className}</div>;
            }
        },

    ]


    useEffect(() => {
        getOrders()
    }, [user]);


    return (
        <TableComponent data={orders} columns={columns}></TableComponent>
    )
}

export default UserOrder;