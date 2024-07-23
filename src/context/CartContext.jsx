import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(() => {
        const savedQuantity = localStorage.getItem("cartQuantity");
        return savedQuantity ? JSON.parse(savedQuantity) : 0;
    });

    useEffect(() => {
        if (cartQuantity > 0) {
            localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
        } else {
            localStorage.removeItem("cartQuantity");
        }
    }, [cartQuantity]);

    const addToCart = () => {
        setCartQuantity(prevQuantity => prevQuantity + 1);
    };

    const removeFromCart = () => {
        setCartQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
    };

    const removeFromCartByAmount = (amount) => {
        setCartQuantity(prevQuantity => (prevQuantity - amount >= 0 ? prevQuantity - amount : 0));
    };

    return (
        <CartContext.Provider value={{ cartQuantity, addToCart, removeFromCart, removeFromCartByAmount }}>
            {children}
        </CartContext.Provider>
    );
};
