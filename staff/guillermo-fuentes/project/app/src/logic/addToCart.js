import { SystemError, validate } from "com";
import { data } from "../data";

export const addToCart = (productId, quantity) => {
  validate.productId(productId);
  validate.quantity(quantity);
  return fetch(`${import.meta.env.VITE_API_URL}cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.getToken()}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  })
    .catch(() => {
      throw new SystemError("Connection error");
    })
    .then((response) => {
      const { status } = response;
      if (status === 201) return;
      return response
        .json()
        .catch(() => {
          throw new SystemError("JSON error");
        })
        .then((body) => {
          const { error, message } = body;
          const constructor = error[error] || SystemError;
          throw new constructor(message);
        });
    });
};
