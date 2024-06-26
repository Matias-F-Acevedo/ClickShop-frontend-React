import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import "./review.css"
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";
import dayjs from 'dayjs';
import RatingForm from '../ratingForm/RatingForm';
import { getAll } from '../../service/functionsHTTP';

function Review({ productId }) {

    const [reviews, setReviews] = useState([]);
    const { user } = useContext(UserContext);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const jwt = user.jwt;


    async function getReviewByProductId(productId) {
        const url = `http://localhost:3000/api/review?productId=${productId}`;
        const res = await getAll(url, user.jwt)
        if (!res.ok) {
            console.log("no hay reviews");
            return
        }
        const parsed = await res.json();
        // ordenar las reviews por fecha descendente
        const sortedReviews = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(sortedReviews);
    }


    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    useEffect(() => {
        if (user) {
            getReviewByProductId(productId);
            checkUserOrders(user.sub);
        }
    }, [user, productId, reviews]);


    async function checkUserOrders(userId) {
        try {
            const url = `http://localhost:3000/api/order?userId=${userId}`;
            const res = await getAll(url, user.jwt)

            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
            const orders = await res.json();
            const completedOrders = orders.filter(order => order.status === 'COMPLETED');
            const productInCompletedOrders = completedOrders.some(order =>
                order.orderDetail.some(detail => detail.product_id === productId)
            );

            const userHasReviewed = reviews.some(review => review.user_id === userId);

            setShowRatingForm(productInCompletedOrders && !userHasReviewed);
        } catch (error) {
            console.error(error);
        }
    }




    return (
        <section id='reviews'>
            {showRatingForm && <RatingForm productId={productId} userId={user.sub} />}
            <div className='reviews-heading'>
                <h3>Opiniones del producto</h3>
            </div>


            <div className='review-box-container'>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div className='review-box' key={index}>
                            <div className='box-top'>
                                <div className='profile-review'>
                                    <div className='profile-img-review'>
                                        <img src={review.user.user_image} alt="" />
                                    </div>
                                    <div className='name-user-review'>
                                        <strong>{`${capitalizeFirstLetter(review.user.user_name)} ${capitalizeFirstLetter(review.user.user_lastname)}`}</strong>
                                        <span>@{`${capitalizeFirstLetter(review.user.user_name)}${review.user.user_lastname}`}</span>
                                    </div>
                                </div>

                                <div className='reviews'>
                                    {[...Array(5)].map((_, i) => (
                                        i < review.score ? <MdOutlineStar key={i} /> : <MdOutlineStarBorder key={i} />
                                    ))}
                                </div>
                            </div>
                            <div className='client-comment'>
                                <p>{capitalizeFirstLetter(review.commentary)}</p>
                                <p className='date-review'>{dayjs(review.date).format("DD/MM/YYYY")}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='no-reviews-p'>No hay opiniones para este producto.</p>
                )}
            </div>
        </section>
    );
}

export default Review;