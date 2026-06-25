import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import App from "../app/App";
import EmailVerified from "../features/auth/pages/EmailVerified";

export const router = createBrowserRouter([
    {
        path:'/login',
        element : <Login/ >
    },
    {
        path:'/register',
        element : <Register/ >
    },
    {
        path:'/',
        element : <App/ >
    },
    {
        path:'/emailVerified',
        element : <EmailVerified/ >
    },
])