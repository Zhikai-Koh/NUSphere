import {createContext, useState, useEffect, useRef} from "react";

function NavigateTo({page, buttonDisplay}){
    return(
        <div style ={{
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            backgroundColor: '#555',
            padding: '10px 20px',
            borderRadius: '120px',
            border: '1px solid black',
            cursor: 'pointer',
            width: '250px',
        }}>
            {buttonDisplay}
        </div>
    )
}

export function NavigationBar() {
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: 'white',
            color: 'white',
            padding: '10px 0',

            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
        }}>
            <NavigateTo page="open-market" buttonDisplay="Open Market" />
            <NavigateTo page="add-listing" buttonDisplay="Add Listing" />
            <NavigateTo page="shops" buttonDisplay="Shops" />

        </div>
    )
}
