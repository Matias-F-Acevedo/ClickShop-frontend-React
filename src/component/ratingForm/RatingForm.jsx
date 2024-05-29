import React, { useState, useEffect } from 'react';
import "./ratingForm.css"
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";
import Swal from 'sweetalert2';


function RatingForm({ userId, productId }) {
    const [rating, setRating] = useState(0);
    const [opinion, setOpinion] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function handleStarClick(index) {
        // suma 1 a la calificación si la estrella no está seleccionada, de lo contrario, establece la calificación en 0
        setRating(prevRating => prevRating === index ? 0 : index);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (rating === 0) {
            setErrorMessage('Por favor, seleccione una calificación.');
        } else if (opinion.length < 10 || opinion.length > 255) {
            setErrorMessage('La opinión debe tener entre 10 y 255 caracteres.');
        } else {
            try {
                const res = await fetch("http://localhost:3000/api/review", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "product_id": productId,
                        "user_id": userId,
                        "score": rating,
                        "commentary": opinion
                    }),
                });
                const parsed = await res.json()
                if (!res.ok || parsed.status == 409 || parsed.status == 400 || parsed.status == 404) {
                    throw new Error('Error al enviar la calificación');
                }
                setRating(0);
                setOpinion("");
                setErrorMessage("");

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Calificación enviada con éxito',
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true,
                    customClass: {
                        popup: 'swal2-toast-custom'
                    }
                });
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error al enviar la calificación',
                    text: error.message,
                    showConfirmButton: true,
                    customClass: {
                        popup: 'swal2-toast-custom'
                    }
                });
            }
        }
    };


    function handleCancel(event) {
        event.preventDefault();

        setRating(0);
        setOpinion("");
        setErrorMessage("");

    }

    return (
        <div className='wrapper-ratingForm'>
            <h2>Compártenos tu opinión sobre este producto</h2>
            <form onSubmit={handleSubmit}>
                <div className='rating'>
                    {[1, 2, 3, 4, 5].map(index => (
                        <span key={index} onClick={() => handleStarClick(index)}>
                            {index <= rating ? <MdOutlineStar className='star selected' /> : <MdOutlineStarBorder className='star' />}
                        </span>
                    ))}
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <textarea name="opinion-rating" cols={30} rows={5} placeholder='Tú opinión del producto...' value={opinion} onChange={(e) => setOpinion(e.target.value)} minLength={10} maxLength={255} required></textarea>

                <div className='btn-group-rating'>
                    <button type='submit' className='btn btn-submit-rating'>Enviar</button>
                    <button onClick={(event) => handleCancel(event)} className='btn  btn-cancel-rating'>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default RatingForm;