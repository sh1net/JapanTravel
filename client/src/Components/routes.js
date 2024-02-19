import AboutUs from "../Pages/AboutUs"
import Basket from "../Pages/Basket"
import Admin from "../Pages/Admin"
import Contacts from "../Pages/Contacts"
import Login from "../Pages/Login"
import Main from "../Pages/Main"
import Registration from "../Pages/Registration"
import Tours from "../Pages/Tours"
import User from "../Pages/User"
import TourAbout from "../Pages/TourAbout"

import { ADMIN_ROUTE } from "../utils/consts"
import { BASKET_ROUTE } from "../utils/consts"
import { CONTACTS_ROUTE } from "../utils/consts"
import { LOGIN_ROUTE } from "../utils/consts"
import { MAIN_ROUTE } from "../utils/consts"
import { REGISTRATION_ROUTE } from "../utils/consts"
import { TOURS_ROUTE } from "../utils/consts"
import { USER_ROUTE } from "../utils/consts"
import { ABOUTUS_ROUTE } from "../utils/consts"
import { TOURABOUT_ROUTE } from "../utils/consts"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin/>
    },
    {
        path: BASKET_ROUTE,
        element: <Basket/>
    },
    {
        path: USER_ROUTE,
        element: <User/>,
    },
]

export const publicRoutes = [
    {
        path: CONTACTS_ROUTE,
        element: <Contacts/>
    },
    {
        path: LOGIN_ROUTE,
        element: <Login/>
    },
    {
        path: MAIN_ROUTE,
        element: <Main/>
    },
    {
        path: REGISTRATION_ROUTE,
        element: <Registration/>
    },
    {
        path: TOURS_ROUTE,
        element: <Tours/>
    },
    {
        path: ABOUTUS_ROUTE,
        element: <AboutUs/>
    },
    {
        path: TOURABOUT_ROUTE +'/:id',
        element: <TourAbout/>
    },
]