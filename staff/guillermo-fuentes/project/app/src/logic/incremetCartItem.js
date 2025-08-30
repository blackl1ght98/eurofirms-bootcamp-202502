import { SystemError, validate } from "com";
import { data } from "../data";

export const incrementCartItem = (userId, cartItemId) => {
  validate.userId(userId);
  validate.cartItemId(cartItemId);
  return fetch(`${import.meta.env.VITE_API_URL}cart/item/${cartItemId}/increment`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${data.getToken()}`,
      "Content-Type": "application/json",
    },
  })
    .catch(() => {
      throw new SystemError("connection error");
    })
    .then((response) => {
      const { status } = response;
      if (status === 200) return;
      return response
        .json()
        .catch(() => {
          throw new SystemError("JSON parsing error");
        })
        .then((body) => {
          const { error, message } = body;
          const constructor = error[error] || SystemError;
          throw new constructor(message);
        });
    });
};
