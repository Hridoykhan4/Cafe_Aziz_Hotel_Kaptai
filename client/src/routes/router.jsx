import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import Main from "../layout/Main";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import UserRoute from "./UserRoute";

// --- Higher Order Component for Lazy Loading ---
// eslint-disable-next-line react-refresh/only-export-components, no-unused-vars
const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

// --- Lazy Loaded Pages ---
const Home = Loadable(lazy(() => import("../pages/Home/Home/Home")));
const Menu = Loadable(lazy(() => import("../pages/Menu/Menu/Menu")));
const Order = Loadable(lazy(() => import("../pages/Order/Order/Order")));
const Contact = Loadable(
  lazy(() => import("../pages/Contact/Contact/Contact")),
);
const Login = Loadable(lazy(() => import("../pages/Login/Login")));
const SignUp = Loadable(lazy(() => import("../pages/SignUp/SignUp")));

// Dashboard Layout & Pages
const DashboardLayout = Loadable(lazy(() => import("../layout/Dashboard")));
const UserHome = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/UserHome/UserHome")),
);
const Cart = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/Cart/Cart")),
);
const Payment = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/Payment/Payment")),
);
const PaymentHistory = Loadable(
  lazy(
    () => import("../pages/Dashboard/Customer/PaymentHistory/PaymentHistory"),
  ),
);
const OrderItems = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/PaymentHistory/OrderItems")),
);
const AddReview = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/AddReview/AddReview")),
);
const Reservation = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/Reservation/Reservation")),
);
const Bookings = Loadable(
  lazy(() => import("../pages/Dashboard/Customer/Bookings/Bookings")),
);

// Admin Pages
const AdminHome = Loadable(
  lazy(() => import("../pages/Dashboard/Admin/AdminHome/AdminHome")),
);
const AllUsers = Loadable(
  lazy(() => import("../pages/Dashboard/Admin/AllUsers/AllUsers")),
);
const ManageItems = Loadable(
  lazy(() => import("../pages/Dashboard/Admin/ManageItems/ManageItems")),
);
const ItemFormPage = Loadable(
  lazy(() => import("../components/ItemFormPage/ItemFormPage")),
);
const ManageBookings = Loadable(
  lazy(() => import("../pages/Dashboard/Admin/ManageBookings/ManageBookings")),
);

// --- Router Configuration ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "order/:category", element: <Order /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // User
      {
        path: "userHome",
        element: (
          <UserRoute>
            <UserHome />
          </UserRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <UserRoute>
            <Cart />
          </UserRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <UserRoute>
            <Payment />
          </UserRoute>
        ),
      },
      {
        path: "payment_history",
        element: (
          <UserRoute>
            <PaymentHistory />
          </UserRoute>
        ),
        children: [{ path: "menuIds", element: <OrderItems /> }],
      },
      { path: "review", element: <AddReview /> },
      { path: "reservation", element: <Reservation /> },
      { path: "bookings", element: <Bookings /> },

      // Admin
      {
        path: "adminHome",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "allUsers",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "addItems",
        element: (
          <AdminRoute>
            <ItemFormPage mode="add" />
          </AdminRoute>
        ),
      },
      {
        path: "manageItems",
        element: (
          <AdminRoute>
            <ManageItems />
          </AdminRoute>
        ),
      },
      {
        path: "updateItems/:id",
        element: (
          <AdminRoute>
            <ItemFormPage mode="update" />
          </AdminRoute>
        ),
      },
      {
        path: "manageBooking",
        element: (
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "*", element: <ErrorPage /> },
]);

export default router;
