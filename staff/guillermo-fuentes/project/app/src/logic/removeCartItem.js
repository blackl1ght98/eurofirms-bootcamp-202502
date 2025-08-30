import { SystemError } from "com";
import { data } from "../data";

export const removeCartItem = (cartItemId) => {
  if (!cartItemId) {
    throw new SystemError("cartItemId es requerido");
  }

  const token = data.getToken();
  if (!token) {
    throw new SystemError("Debes iniciar sesión para eliminar del carrito");
  }

  console.debug("Removing cart item:", { cartItemId, token });

  return fetch(`${import.meta.env.VITE_API_URL}cart/item/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .catch(() => {
      throw new SystemError("Error de conexión");
    })
    .then((response) => {
      console.debug("Response status:", response.status);
      const { status } = response;
      if (status === 204) return;
      return response
        .json()
        .catch(() => {
          throw new SystemError("Error al parsear JSON");
        })
        .then((body) => {
          const { error, message } = body;
          const constructor = error[error] || SystemError;
          throw new constructor(message);
        });
    });
};
