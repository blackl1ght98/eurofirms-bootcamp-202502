import { logic } from "../logic";
import { useState, useEffect } from "react";
import { useContext } from "../context/context";
import { CartItem } from "./components/CartItem";
import { data } from "../data";
import { getPayloadFromToken } from "../logic/helper/getPayloadFromToken";
export const CartItems = () => {
  const [cart, setCart] = useState(null);
  const { alert } = useContext();

  useEffect(() => {
    try {
      logic
        .getCartItems()
        .then((cartData) => {
          console.debug("Cart received:", cartData);
          setCart(cartData);
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }, []);
  const token = data.getToken();
  const userId = getPayloadFromToken(token);
  const handleCheckout = () => {
    logic
      .checkoutCart(userId.sub)
      .then(() => {
        alert("checkout exitoso");
        setCart(null);
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carrito</h1>

      {cart ? (
        <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orden: {cart.numberOrder}</h2>
          <p>
            <span className="font-semibold">Fecha:</span>{" "}
            {new Date(cart.dateOrder).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <span className="font-semibold">Usuario:</span> {cart.user}
          </p>
          <p>
            <span className="font-semibold">Total:</span> {cart.total} {cart.currency}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {cart.products.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onItemRemoved={() => {
                  // Recargar el carrito tras eliminar un ítem
                  logic
                    .getCartItems()
                    .then((cartData) => setCart(cartData))
                    .catch((error) => alert(error.message));
                }}
              />
            ))}
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6"
            onClick={handleCheckout}
          >
            Proceder al Pago
          </button>
        </div>
      ) : (
        <div className="col-span-full text-center mt-8 text-gray-500 text-lg">🛒 No hay productos en el carrito</div>
      )}
    </div>
  );
};
