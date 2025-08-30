import { SystemError, validate } from "com";
import { data } from "../data";

export const updateOrder = (orderId, newState) => {
  validate.orderId(orderId);
  validate.stateOrder(newState);
  return fetch(`${import.meta.env.VITE_API_URL}orders/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${data.getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newState }),
  })
    .catch(() => {
      throw new SystemError("connection error");
    })
    .then((response) => {
      const { status } = response;
      if (status === 201) return;
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
