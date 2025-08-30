import { useState } from "react";
import { logic } from "../../logic";
import { EditOrder } from "../EditOrder";
import { useContext } from "../../context/context";
import { useNavigate } from "react-router";
import { data } from "../../data";
import { getPayloadFromToken } from "../../logic/helper/getPayloadFromToken";

export const Order = ({ order, onReloadOrder, onEditedOrder }) => {
  const [editOrder, setEditOrder] = useState(false);
  const { alert, confirm } = useContext();
  const navigate = useNavigate();

  const handleEditOrder = () => {
    setEditOrder(false);
    onReloadOrder();
  };

  const token = data.getToken();
  const userId = getPayloadFromToken(token);

  const handleDeleteClick = () => {
    confirm("¿Eliminar orden?").then((result) => {
      if (result) {
        try {
          logic
            .deleteOrder(userId.sub, order.id)
            .then(() => onEditedOrder())
            .catch((error) => {
              console.error(error);
              alert(error.message);
            });
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }
    });
  };

  return (
    <>
      <div className="max-w-sm w-full bg-white border border-gray-300 rounded-2xl shadow-md p-6 m-4 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{order.numberOrder}</h2>
          </div>
        </div>

        <div className="space-y-3 text-base text-gray-800">
          <p>
            <span className="font-semibold">Fecha de la orden:</span>{" "}
            {new Date(order.dateOrder).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <span className="font-semibold">Estado:</span>{" "}
            <span className="text-green-700 font-bold">{order.stateOrder}</span>
          </p>
          <p>
            <span className="font-semibold">Es coche:</span> {order.isCar ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-semibold">Usuario:</span> {order.user}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {/**Para navegar a una ruta que requiere parametros se hace como vemos a continuacion en el onclick */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200"
            onClick={() => navigate(`/orderDetails/${order.id}`)}
          >
            Ver Detalles
          </button>
          <button
            className="w-full bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-white font-semibold py-3 rounded-lg transition duration-200"
            onClick={() => setEditOrder(true)}
          >
            Actualizar Orden
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Eliminar Orden
          </button>
        </div>

        {editOrder && <EditOrder order={order} onEditedOrder={handleEditOrder} />}
      </div>
    </>
  );
};
