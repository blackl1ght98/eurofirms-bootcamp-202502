import { SystemError } from "com";
import { data } from "../data";

export const getOrderDetail = (orderId) => {
  return fetch(`${import.meta.env.VITE_API_URL}orders/${orderId}`, {
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
      if (status === 200) {
        return response.json().then((order) => order);
      }
      return response.json().then(({ error, message }) => {
        const constructor = error[error] || SystemError;
        throw new constructor(message);
      });
    });
};
