import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './Store/UserStore';
import TourStore from './Store/TourStore';
import { createContext } from 'react';


export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        tour: new TourStore()
    }}>
        <App />
    </Context.Provider>,
);
