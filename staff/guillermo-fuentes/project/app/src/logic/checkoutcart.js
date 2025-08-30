import { data } from "../data";
import { SystemError, validate } from "com";

export const checkoutCart = (userId) => {
  validate.userId(userId);

  return fetch(`${import.meta.env.VITE_API_URL}cart/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.getToken()}`,
    },
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
          throw new SystemError("json error");
        })
        .then((body) => {
          const { error, message } = body;
          const constructor = error[error] || SystemError;
          throw new constructor(message);
        });
    });
};
