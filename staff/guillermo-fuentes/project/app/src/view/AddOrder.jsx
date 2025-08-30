import { useState } from "react";
import { logic } from "../logic";
import { SearchProducts } from "./components/SearchProduct";

export const AddOrder = ({ onOrderAdded }) => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceAtOrderTime, setPriceAtOrderTime] = useState(0);
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState("");

  const handleAddProduct = () => {
    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }
    if (!quantity || quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (priceAtOrderTime < 0) {
      setError("Price must be positive");
      return;
    }

    setProductList((prev) => [...prev, { product: selectedProductId, quantity, priceAtOrderTime }]);

    // Clean product fields
    setSelectedProductId("");
    setQuantity(1);
    setPriceAtOrderTime(0);
    setError("");
  };

  const handleRemoveProduct = (index) => {
    setProductList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const numberOrder = form.numberOrder.value;
    const stateOrder = form.stateOrder.value;
    const total = parseInt(form.total.value);
    const currency = form.currency.value;

    if (productList.length === 0) {
      setError("You must add at least one product");
      return;
    }

    logic
      .addOrder(numberOrder, stateOrder, total, currency, false, productList)
      .then(() => {
        form.reset();
        setProductList([]);
        setError("");
        onOrderAdded();
      })
      .catch((error) => {
        const msg = error.message || "Error creating order";
        setError(msg);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add Order</h1>
        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          {/* PRODUCT SELECTOR */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <h2 className="text-xl font-medium text-gray-700 mb-2">Add Product</h2>
            <SearchProducts onSelectProductId={setSelectedProductId} setError={setError} />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min={1}
                />
              </div>
              <div>
                <label htmlFor="priceAtOrderTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Price at Order Time
                </label>
                <input
                  type="number"
                  id="priceAtOrderTime"
                  value={priceAtOrderTime}
                  step="0.01"
                  onChange={(e) => setPriceAtOrderTime(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min={0}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProduct}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
            >
              Add Product to Order
            </button>
          </div>

          {/* PRODUCT LIST */}
          {productList.length > 0 && (
            <div className="border p-4 rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Products in Order</h2>
              <ul className="space-y-2">
                {productList.map((p, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border shadow-sm"
                  >
                    <span>
                      <strong>ID:</strong> {p.product} | <strong>Qty:</strong> {p.quantity} | <strong>Price:</strong> €
                      {p.priceAtOrderTime.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ORDER DETAILS */}
          <div>
            <label htmlFor="numberOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Number Order
            </label>
            <input
              type="text"
              name="numberOrder"
              id="numberOrder"
              placeholder="Insert order number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="stateOrder" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="stateOrder"
              id="stateOrder"
              placeholder="Insert order state"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <input
              type="number"
              name="total"
              id="total"
              placeholder="Total amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              id="currency"
              placeholder="Currency"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* ERROR / SUBMIT */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};
