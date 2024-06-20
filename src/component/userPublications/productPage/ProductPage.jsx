import React from 'react'
import "./productPage.css"
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from '../../../context/UserContext';
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { BsBagCheck } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import Review from '../../review/Review';
import RatingForm from '../../ratingForm/RatingForm';



function ProductPage() {


    const { user, handleLogout } = useContext(UserContext);
    const divSelect1 = useRef();
    const divSelect2 = useRef();
    const divSelect3 = useRef();
    const { productId } = useParams();
    const [product, setProduct] = useState()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagesProduct, setImagesProduct] = useState([])
    const [principalImage, setPrincipalImage] = useState(imagesProduct[0])
    const [reviews, setReviews] = useState([]);
    const [addedToCart, setAddedToCart] = useState(false);


    

    useEffect(() => {


        async function fetchProductDetails() {
            try {
                const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
                });
                if (!res.ok) {
                    throw new Error('No se pudo obtener los detalles del producto');
                }
                const data = await res.json();
                setImagesProduct(data.product_image)
                setPrincipalImage(data.product_image[0])
                setProduct(data);

                const reviewsRes = await fetch(`http://localhost:3000/api/review?productId=${productId}`);
                if (!reviewsRes.ok) {
                    throw new Error('No se pudo obtener las reseñas del producto');
                }
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetails();

    }, [productId, user]);
  
    
    
    const handleAddToCart = async () => {
      
        const URLCartUser = `http://localhost:3000/api/cart/${user.sub}`
        try {
          if (user) {
            const jwt = user.jwt;
            const newProduct = {
              product_id: product.productId,
              quantity: 1,
              unitPrice: product.price
            }
            await fetch(URLCartUser, {
              method: 'POST',
              headers: { "Content-Type": "application/json",
                Authorization:`Bearer ${jwt}`
                },
              body: JSON.stringify(newProduct ),  
            });
            console.log(newProduct)
            console.log("se agrego el producto al carrito")
            setAddedToCart(true);
          } else {
            console.error("El usuario no está definido.");
          }
        } catch (error) {
          console.error("Error al agregar el producto al carrito:", error);
        }
      };

    function changeImageAndActiveClass(img, divSelect) {
        setPrincipalImage(img);

        if (divSelect1.current) {
            divSelect1.current.classList.remove('active');
        }
        if (divSelect2.current) {
            divSelect2.current.classList.remove('active');
        }
        if (divSelect3.current) {
            divSelect3.current.classList.remove('active');
        }

        divSelect.current.classList.add('active');
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No se encontró el producto.</div>;
    }


    return (
        <>

            <div className='main-wrapper'>
                <div className='container-products'>
                    <div className='product-div'>
                        <div className='product-div-left'>
                            <div className="img-container">
                                <img src={principalImage} alt="product-image-1" />
                            </div>
                            <div className='hover-container'>

                                {product.product_image.length === 1 ? (
                                    <div ref={divSelect1} className='active' onMouseOver={() => changeImageAndActiveClass(product.product_image[0], divSelect1)}>
                                        <img src={product.product_image[0]} alt='product-thumb-1' />
                                    </div>
                                ) : (
                                    product.product_image.map((image, index) => (
                                        <div key={index} ref={index === 0 ? divSelect1 : index === 1 ? divSelect2 : divSelect3} onMouseOver={() => changeImageAndActiveClass(image, index === 0 ? divSelect1 : index === 1 ? divSelect2 : divSelect3)}>
                                            <img src={image} alt={`product-thumb-${index + 1}`} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className='product-div-right'>
                            <span className='product-name'>{product.product_name}</span>
                            <span className='product-price'>${product.price}</span>
                            <div className='product-rating'>
                                <span><MdOutlineStar /></span>
                                <span><MdOutlineStar /></span>
                                <span><MdOutlineStar /></span>
                                <span><MdOutlineStar /></span>
                                <span><MdOutlineStarBorder /></span>
                                <span>({reviews.length} Opiniones del producto)</span>
                            </div>
                            <p className='product-description'> {product.description}</p>
                            <div className='btn-groups'>
                                <button className='add-cart-btn' onClick={() => handleAddToCart(productId)}> <BsCart3 className='icon-add-cart' /> Agregar al carrito</button>
                                <button className='buy-now-btn'><BsBagCheck className='icon-buy' />  Comprar ahora</button>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <Review productId={product.productId}></Review>
        </>
    )


}

export default ProductPage;