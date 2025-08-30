import { SystemError } from "com";
import { data } from "../data";

export const getCartItems = () => {
  return fetch(`${import.meta.env.VITE_API_URL}cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.getToken()}`,
    },
  })
    .catch(() => {
      throw new SystemError("Connection error");
    })
    .then((response) => {
      const { status } = response;
      if (status === 200)
        return response
          .json()
          .catch(() => {
            throw new SystemError("json error");
          })
          .then((orders) => {
            console.debug("Orders received ", orders);
            return orders;
          });
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
