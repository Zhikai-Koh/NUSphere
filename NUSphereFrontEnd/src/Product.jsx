import {createContext, useState, useEffect} from "react";
function StoreItems({ data, loading }) {
    return (
      loading ? <p>Loading cart items...</p> :
          data.length === 0 ? <h2>Your cart is empty</h2> :
        <>
          <h2 style={{ margin: '20px', fontSize: '48px' }}>Cart Items</h2>

          <div style={{
            display: 'grid',
            // The magic line: grid calculates minimum 250px cards, filling the row automatically
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px', // Spacing between cards
            width: '100%',
            boxSizing: 'border-box'
          }}>

            {data.map((cartItem) => (
                <div 
                  key={cartItem.id} 
                  style={{
                          backgroundColor: '#f9f9f9',
                          border: '1px solid #e0e0e0', 
                          borderRadius: '10px',
                          padding: '20px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                >

                  <h4 style={{ margin: 0, fontSize: '20px', color: '#4b4747' }}>
                  {cartItem.item_name}
                  </h4>

                  <div style={{ color: '#666', fontSize: '14px' }}>
                    Quantity: <strong style={{ color: '#000' }}>{cartItem.quantity}</strong>
                  </div>

                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#2e7d32', 
                    marginTop: 'auto',
                    paddingTop: '10px',
                    textAlign: 'right',
                    paddingTop: '20px'
                  }}>
                    ${parseFloat(cartItem.item_price).toFixed(2)}
                  </div>
                </div>
            ))}
          </div>
        </>
    );
}


export function Product() {
    return(
        <div>
            <h1>Product Page</h1>
        </div>
    )
}