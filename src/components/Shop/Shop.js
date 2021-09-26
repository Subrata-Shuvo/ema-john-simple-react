import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    // products to be rendered on the UI
    const [displayProducts, setDisplayProducts] = useState([])


    useEffect(()=>{   
        fetch("./products.JSON")
        .then(res => res.json())
        .then(data => {
            setProducts(data)
            setDisplayProducts(data);
        });
    } , [])

    useEffect(()=>{
        
      if(products.length){
        const savedCart = getStoredCart();
        const storedCart = []
        for (const key in savedCart){
            const adddedProduct = 
            products.find( product => product.key === key);

            if(adddedProduct){
                const quantity = savedCart[key];
                adddedProduct.quantity = quantity;
                storedCart.push(adddedProduct);
            }
        }
        setCart(storedCart);
      }
    }, [products])

    const handleAddToCart = (product) =>{
        const newCart = [...cart, product];
        setCart(newCart);
        // save to local storage (for now)
        addToDb(product.key)
    }
        const handleSearch = event =>{
            const searchText = event.target.value;

            const macthedProducts = products.filter(product=> product.name.toLowerCase().includes(searchText.toLowerCase()));

            setDisplayProducts(macthedProducts);
    }
    return (
        <>
            <div className="search-container">
            <input 
            type="text"
            onChange={handleSearch}
            placeholder="Search product"/>
        </div>
        <div className="shop-container">
            <div className="product-container">
                {
                    displayProducts.map(product=> <Product 
                        key={product.key}
                        product={product}
                        handleAddToCart={handleAddToCart}>
                        </Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
            
        </div>

        </>
    );
};

export default Shop;