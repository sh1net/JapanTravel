import AboutUs from "../Pages/AboutUs"
import Basket from "../Pages/Basket"
import Contacts from "../Pages/Contacts"
import Main from "../Pages/Main/Main"
import Authorization from "../Pages/Authorization"
import Tours from "../Pages/Tours"
import User from "../Pages/User"
import TourAbout from "../Pages/TourAbout"
import HotelAbout from "../Pages/HotelAbout"

import { COMBTOURABOUT_ROUTE } from "../utils/consts"
import { BASKET_ROUTE } from "../utils/consts"
import { CONTACTS_ROUTE } from "../utils/consts"
import { MAIN_ROUTE } from "../utils/consts"
import { TOURS_ROUTE } from "../utils/consts"
import { USER_ROUTE } from "../utils/consts"
import { ABOUTUS_ROUTE } from "../utils/consts"
import { TOURABOUT_ROUTE } from "../utils/consts"
import { REGISTRATION_ROUTE } from "../utils/consts"
import { LOGIN_ROUTE } from "../utils/consts"
import { HOTELABOUT_ROUTE } from "../utils/consts"
import ComboTourAbout from "../Pages/ComboTourAbout"

export const authRoutes = [
    {
        path: BASKET_ROUTE,
        element: <Basket/>,
    },
    {
        path: USER_ROUTE,
        element: <User/>,
    },
    {
        path: MAIN_ROUTE,
        element: <Main/>
    },
]

export const publicRoutes = [
    {
        path: CONTACTS_ROUTE,
        element: <Contacts/>
    },
    {
        path: MAIN_ROUTE,
        element: <Main/>
    },
    {
        path: REGISTRATION_ROUTE,
        element: <Authorization/>
    },
    {
        path: LOGIN_ROUTE,
        element: <Authorization/>
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
    {
        path: HOTELABOUT_ROUTE +'/:id',
        element: <HotelAbout/>
    },
    {
        path: COMBTOURABOUT_ROUTE+'/:id',
        element: <ComboTourAbout/>
    }
]