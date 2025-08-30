import { logic } from "../logic";
import { useState } from "react";
import { useRole } from "../hooks/useRole";
import { SearchProviders } from "./components/SearchProviders";
import { useContext } from "../context/context";

export const EditOrder = ({ order, onEditedOrder }) => {
  const [stateOrder, setStateOrder] = useState(order.stateOrder);

  const { isAdmin } = useRole();

  const { alert } = useContext();

  const handleEditOrder = () => onEditedOrder();

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const stateOrder = form.stateOrder.value;

    if (!isAdmin) {
      alert("you dont authorized for action");
      return;
    }

    try {
      logic
        .updateOrder(order.id, stateOrder)
        .then(() => {
          form.reset();

          handleEditOrder();
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center  bg-opacity-25
     px-4 fixed inset-0  z-10"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6 text-4xl text-blue-500">
          <i className="fas fa-user-plus"></i>
        </div>
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Update Order</h1>
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <div>
            <label htmlFor="stateOrder" className="block text-sm font-medium text-gray-700 mb-1">
              State Order
            </label>
            <input
              type="text"
              name="stateOrder"
              id="stateOrder"
              value={stateOrder}
              onChange={(event) => setStateOrder(event.target.value)}
              placeholder="El del nuevo estado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
            >
              Update Order
            </button>

            <button
              type="submit"
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
              onClick={() => handleEditOrder()}
            >
              Cancel update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
