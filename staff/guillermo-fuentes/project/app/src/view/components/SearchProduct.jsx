import { useState, useEffect, useMemo } from "react";
import { logic } from "../../logic";
import debounce from "lodash/debounce";
import { data } from "../../data";
import { getPayloadFromToken } from "../../logic/helper/getPayloadFromToken";
//Componente usado en AddOrder.jsx.
export const SearchProducts = ({ onSelectProductId, setError = () => {} }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [productSelect, setProductSelect] = useState(false);
  const token = data.getToken();
  const userId = getPayloadFromToken(token);
  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((query) => {
        logic
          .getProductsSuggestions(userId.sub, query)
          .then((providers) => {
            setSuggestions(providers);
          })
          .catch((error) => {
            setError(error);
            alert(error.message);
          });
      }, 300),
    []
  );

  const handleSelectProduct = (product) => {
    setQuery(product.name);
    onSelectProductId(product.id);
    setSuggestions([]);
    setError("");
    setProductSelect(true);
  };

  useEffect(() => {
    if (query && !productSelect) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
      setError("");
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query]);

  return (
    <div>
      <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700 mb-1">
        Products
      </label>
      <input
        type="text"
        id="productSearch"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setProductSelect(false);
        }}
        placeholder="Search user by name"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto bg-white">
          {suggestions.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSelectProduct(product)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
