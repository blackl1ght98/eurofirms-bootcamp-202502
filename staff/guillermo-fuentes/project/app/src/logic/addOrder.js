import { SystemError, validate } from "com";
import { data } from "../data";

export const addOrder = (numberOrder, stateOrder, total, currency, isCar, products) => {
  validate.numberOrder(numberOrder);
  validate.stateOrder(stateOrder);
  validate.total(total);
  validate.currency(currency);

  return fetch(`${import.meta.env.VITE_API_URL}orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.getToken()}`,
    },
    body: JSON.stringify({
      numberOrder,
      stateOrder,
      total,
      currency,
      isCar,
      products,
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
