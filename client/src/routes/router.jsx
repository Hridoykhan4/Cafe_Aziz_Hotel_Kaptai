import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home/Home";
import Menu from "../pages/Menu/Menu/Menu";
import Order from "../pages/Order/Order/Order";
import Contact from "../pages/Contact/Contact/Contact";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../layout/Dashboard";
import Cart from "../pages/Dashboard/Customer/Cart/Cart";
import AllUsers from "../pages/Dashboard/Admin/AllUsers/AllUsers";
import AdminRoute from "./AdminRoute";
import ManageItems from "../pages/Dashboard/Admin/ManageItems/ManageItems";
import ItemFormPage from "../components/ItemFormPage/ItemFormPage";
import Payment from "../pages/Dashboard/Customer/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/Customer/PaymentHistory/PaymentHistory";
import OrderItems from "../pages/Dashboard/Customer/PaymentHistory/OrderItems";
import AdminHome from "../pages/Dashboard/Admin/AdminHome/AdminHome";
import UserHome from "../pages/Dashboard/Customer/UserHome/UserHome";
import ManageBookings from "../pages/Dashboard/Admin/ManageBookings/ManageBookings";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AddReview from "../pages/Dashboard/Customer/AddReview/AddReview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/menu",
        element: <Menu></Menu>,
      },
      {
        path: "/order/:category",
        element: <Order></Order>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "userHome",
        element: <UserHome></UserHome>,
      },
      {
        path: "cart",
        element: <Cart></Cart>,
      },
      {
        path: "payment",
        element: <Payment></Payment>,
      },
      {
        path: "payment_history",
        element: <PaymentHistory></PaymentHistory>,
        children: [
          {
            path: "menuIds",
            element: <OrderItems></OrderItems>,
          },
        ],
      },
      {
        path: 'review',
        element: <AddReview></AddReview>
      },
      // Admin Routes
      {
        path: "adminHome",
        element: (
          <AdminRoute>
            <AdminHome></AdminHome>
          </AdminRoute>
        ),
      },
      {
        path: "allUsers",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "addItems",
        element: (
          <AdminRoute>
            <ItemFormPage mode="add"></ItemFormPage>
          </AdminRoute>
        ),
      },
      {
        path: "manageItems",
        element: (
          <AdminRoute>
            <ManageItems></ManageItems>
          </AdminRoute>
        ),
      },
      {
        path: "updateItems/:id",
        element: (
          <AdminRoute>
            <ItemFormPage mode="update"></ItemFormPage>
          </AdminRoute>
        ),
      },
      {
        path: "manageBooking",
        element: (
          <AdminRoute>
            <ManageBookings></ManageBookings>
          </AdminRoute>
        ),
      },
      
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <SignUp></SignUp>,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
