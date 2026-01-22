import { useEffect, useState } from "react";
import { logic } from "./logic";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router";
import { Home } from "./view/Home";
import { Register } from "./view/Register";
import { Login } from "./view/Login";
import { Users } from "./view/Users";
import { Providers } from "./view/Providers";
import { Navbar } from "./view/components/Navbar";
import { Alert } from "./view/components/Alert";
import { Confirm } from "./view/components/Confirm";
import { Context } from "./context/context";
import { AddProvider } from "./view/AddProvider";
import { Products } from "./view/Products";
import { AddProduct } from "./view/AddProduct";
import { useLoggedIn } from "./hooks/useLoggedIn";
import { Orders } from "./view/Orders";
import { AddOrder } from "./view/AddOrder";
import { OrderDetails } from "./view/components/OrderDetails";
import { CartItems } from "./view/CartItems";
export const App = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const loggedIn = useLoggedIn();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = logic.isUserAdministrator();
  useEffect(() => {
    if (location.pathname !== "/") return;
    try {
      const loggedIn = logic.isUserLoggedIn();
      console.debug("the login is " + loggedIn);
      if (loggedIn) {
        navigate("/users", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }, [navigate, location.pathname]);

  const handleAlertAccepted = () => setAlertMessage("");

  const handleAcceptConfirm = () => {
    setConfirmMessage("");

    confirmAction.resolve(true);
  };

  const handleCancelConfirm = () => {
    setConfirmMessage("");

    confirmAction.resolve(false);
  };

  const handleShowConfirm = (message) => {
    setConfirmMessage(message);

    return new Promise((resolve) => {
      setConfirmAction({ resolve });
    });
  };
  // Navegacion
  const handleRegisterClicked = () => navigate("/register");
  const handleUserLoggedIn = () => navigate("/users");
  const handleProductAdded = () => navigate("/products");
  const handleOrderAdded = () => navigate("/orders");
  const handleUserRegistered = () => navigate("/login");
  const handleUserRegisteredAdmin = () => navigate("/users");
  const handleRegisterCancel = () => navigate("/login");
  const handleProviderAdded = () => navigate("/providers");
  return (
    <Context.Provider
      value={{
        alert: setAlertMessage,
        confirm: handleShowConfirm,
      }}
    >
      {alertMessage && <Alert message={alertMessage} onAccepted={handleAlertAccepted} />}

      {confirmMessage && (
        <Confirm message={confirmMessage} onCancelled={handleCancelConfirm} onAccepted={handleAcceptConfirm} />
      )}
      <Navbar />
      <Routes>
        <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/register"
          element={
            !loggedIn || isAdmin ? (
              /**Estos valores que le pasamos al componente registes son funciones que luego
               * podemos ejecutar dentro del componente Register cuando queramos navegar a otra pantalla.
               */
              <Register
                onUserRegistered={handleUserRegistered}
                onUserRegisteredAdmin={handleUserRegisteredAdmin}
                onRegisterCancel={handleRegisterCancel}
              />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/addProvider"
          element={loggedIn ? <AddProvider onProviderAdded={handleProviderAdded} /> : <Navigate to="/login" />}
        />
        <Route
          path="/addProduct"
          element={loggedIn ? <AddProduct onProductAdded={handleOrderAdded} /> : <Navigate to="/login" />}
        />
        <Route
          path="/addOrder"
          element={loggedIn ? <AddOrder onOrderAdded={handleProductAdded} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login onRegisterClicked={handleRegisterClicked} onUserLoggedIn={handleUserLoggedIn} />
            )
          }
        />
        {/** Cuando se quiere capturar algun parametro que viene por la url en react se hace asi: path="/orderDetails/:orderId" los ":" indica que lo que viene es un parametro*/}
        <Route path="/orderDetails/:orderId" element={loggedIn ? <OrderDetails /> : <Navigate to="/login" />} />
        <Route path="/carrito" element={loggedIn ? <CartItems /> : <Navigate to="/login" />} />
        <Route path="/users" element={loggedIn ? <Users /> : <Navigate to="/login" />} />
        <Route path="/orders" element={loggedIn ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/providers" element={loggedIn ? <Providers /> : <Navigate to="/login" />} />
        <Route path="/products" element={loggedIn ? <Products /> : <Navigate to="/login" />} />
      </Routes>
    </Context.Provider>
  );
};

export default App;
