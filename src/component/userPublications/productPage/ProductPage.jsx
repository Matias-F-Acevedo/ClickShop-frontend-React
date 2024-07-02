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
import { getAll, getById, post, updatePut } from '../../../service/functionsHTTP';
import Swal from 'sweetalert2';
import BuyProduct from '../../adressForm/BuyProduct';

function ProductPage() {


    const { user} = useContext(UserContext);
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
    const [isBuying, setIsBuying] = useState(false);
    const [cartItems, setCartItems] = useState([])


    

    useEffect(() => {


        async function fetchProductDetails() {
            try {
                const url = "http://localhost:3000/api/products"
                const res = await getById(productId,url)

                if (!res.ok) {
                    throw new Error('Failed to fetch details of product');
                }
                const data = await res.json();
                setImagesProduct(data.product_image)
                setPrincipalImage(data.product_image[0])
                setProduct(data);

                const urlReview = `http://localhost:3000/api/review?productId=${productId}`

                const reviewsRes = await getAll(urlReview);

                if (!reviewsRes.ok) {
                    throw new Error('Failed to fetch review of product');
                }
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

            } catch (error) {
                setError(error.message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetails();

    }, [productId, user]);
  
    const handleBuyProduct = () => {
        setIsBuying(true);
        console.log(product)
         
    };
    
    const handleAddToCart = async () => {
      
        const URLCartUser = `http://localhost:3000/api/cart/${user.sub}`
        const URLCartItems = `http://localhost:3000/api/cart/${user.sub}/items`
        try {
            if (user) {
                const cartItemsRes = await getAll(URLCartItems, user.jwt);
                if (!cartItemsRes.ok) {
                    throw new Error('Failed to fetch user cart');
                }
                const cartItems = await cartItemsRes.json();

                const existingProduct = cartItems.find(item => item.product_id == productId);

                let res;

                if (existingProduct) {
                    const updatedProduct = {
                        quantity: existingProduct.quantity + 1
                    };

                    res = await updatePut(`${URLCartUser}/items/${existingProduct.cartItem_id}/quantity`, updatedProduct, user.jwt);

                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title:'Cantidad del producto actualizada en el carrito',
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

                } else {
                    const newProduct = {
                        product_id: product.productId,
                        quantity: 1,
                        unitPrice: product.price
                    };
                    res = await post(URLCartUser, newProduct, user.jwt);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title:'Agregado al carrito',
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
                if (!res.ok) {
                    throw new Error('Error when adding product to cart');
                }
                setAddedToCart(true);
            } else {
                console.error("The user is not defined");
            }
        } catch (error) {
            console.error("Error when adding product to cart:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'No se pudo agregar el producto al carrito',
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
            {isBuying ? (
                          <BuyProduct cartItems={product} />
                                 ):(
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
                                <button className='buy-now-btn' onClick={handleBuyProduct}><BsBagCheck className='icon-buy'/>  Comprar ahora</button>
                            </div>
                        </div>
                    </div>
                </div>
                                 )}
            </div>
            <Review productId={product.productId}></Review>
        </>
    )


}

export default ProductPage;