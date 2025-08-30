import { useContext } from "../../context/context";
import { logic } from "../../logic";
import { data } from "../../data";
import { getPayloadFromToken } from "../../logic/helper/getPayloadFromToken";
export const CartItem = ({ item, onItemRemoved }) => {
  const { alert, confirm } = useContext();
  const token = data.getToken();
  const userId = getPayloadFromToken(token);
  const handleRemoveItem = () => {
    confirm("¿Eliminar este producto del carrito?").then((result) => {
      if (result) {
        try {
          logic
            .removeCartItem(item.cartItemId)
            .then(() => {
              alert("Producto eliminado del carrito");
              onItemRemoved();
            })
            .catch((error) => {
              console.error("Error removing cart item:", error);
              alert(error.message);
            });
        } catch (error) {
          console.error("Unexpected error:", error);
          alert(error.message);
        }
      }
    });
  };
  const handleIncremetItem = () => {
    logic
      .incrementCartItem(userId.sub, item.cartItemId)
      .then(() => {
        onItemRemoved();
      })
      .catch((error) => {
        console.error("Unexpected error", error);
        alert(error.message);
      });
  };
  const handleDecrementItem = () => {
    logic
      .decrementCartItem(userId.sub, item.cartItemId)
      .then(() => {
        onItemRemoved();
      })
      .catch((error) => {
        console.error("Unexpected error", error);
        alert(error.message);
      });
  };
  if (!item.product) {
    return null;
  }

  return (
    <div className="max-w-sm w-full bg-white border border-gray-300 rounded-2xl shadow-md p-6 m-4 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-900">{item.product.name}</h3>
      <div className="space-y-3 text-base text-gray-800">
        <p>
          <span className="font-semibold">Descripción:</span> {item.product.description}
        </p>
        <p>
          <span className="font-semibold">Cantidad:</span> {item.product.quantity}
        </p>
        <p>
          <span className="font-semibold">Precio por unidad:</span> {item.product.priceAtOrderTime} EUR
        </p>
        <p>
          <span className="font-semibold">Subtotal:</span>{" "}
          {(item.product.quantity * item.product.priceAtOrderTime).toFixed(2)} EUR
        </p>
        <p>
          <span className="font-semibold">Stock disponible:</span> {item.product.stock}
        </p>
      </div>
      <div className="mt-6">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          onClick={handleRemoveItem}
        >
          Eliminar del Carrito
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-2"
          onClick={handleIncremetItem}
        >
          Incrementar cantidad
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-2"
          onClick={handleDecrementItem}
        >
          Decrementar cantidad
        </button>
      </div>
    </div>
  );
};
