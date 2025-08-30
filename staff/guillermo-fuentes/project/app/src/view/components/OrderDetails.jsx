import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { logic } from "../../logic";
import { useContext } from "../../context/context";

export const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const { alert } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      alert("ID de orden no proporcionado");
      return;
    }
    logic
      .getOrderDetail(orderId)
      .then((detailedOrder) => setOrder(detailedOrder))
      .catch((error) => alert(error.message));
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex flex-col items-center mt-10 px-4 animate-pulse">
        <div className="w-full max-w-2xl bg-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-center text-lg">Cargando detalles de la orden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        Detalles de la Orden #{order.numberOrder}
      </h1>

      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-base">
          <p>
            <span className="font-semibold text-gray-600">ID de la orden:</span> {order.orderId}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Número de orden:</span> {order.numberOrder}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Fecha:</span>{" "}
            {new Date(order.dateOrder).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Estado:</span>{" "}
            <span className="text-green-700 font-bold">{order.stateOrder}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600">Es coche:</span> {order.isCar ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Usuario:</span> {order.user}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Total:</span> {order.total} {order.currency}
          </p>
          <p>
            <span className="font-semibold text-gray-600">ID de venta:</span> {order.saleId ?? "No disponible"}
          </p>
          <p>
            <span className="font-semibold text-gray-600">ID de pago:</span> {order.pagoId ?? "No disponible"}
          </p>
        </div>

        {order.products && order.products.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Productos</h2>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p>
                    <span className="font-semibold">Nombre:</span> {item.product.name}
                  </p>
                  <p>
                    <span className="font-semibold">ID:</span> {item.product.productId}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad:</span> {item.product.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Precio:</span> {item.product.priceAtOrderTime} {order.currency}
                  </p>
                  <p>
                    <span className="font-semibold">Proveedor:</span> {item.product.provider.name}
                  </p>
                  <p>
                    <span className="font-semibold">Descripción:</span> {item.product.description}
                  </p>
                  <p>
                    <span className="font-semibold">Stock:</span> {item.product.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
            onClick={() => navigate("/orders")}
          >
            Volver a Órdenes
          </button>
        </div>
      </div>
    </div>
  );
};
