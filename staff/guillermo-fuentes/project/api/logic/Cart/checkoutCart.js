import { User, Order } from "../../data/index.js";
import { validate, NotFoundError, SystemError } from "com";

export const checkoutCart = (userId) => {
  validate.userId(userId);

  return User.findById(userId)
    .catch(() => {
      throw new SystemError("Error en MongoDB");
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Usuario no encontrado");
      }

      return Order.findOne({ user: userId, stateOrder: "cart", isCar: true }).then((cart) => {
        if (!cart) {
          throw new NotFoundError("Carrito no encontrado");
        }
        if (!cart.products.length) {
          throw new SystemError("El carrito está vacío");
        }

        cart.stateOrder = "Pending";
        cart.isCar = false;
        cart.numberOrder = `ORD-${Date.now()}`;
        cart.dateOrder = new Date();

        return cart.save();
      });
    })
    .catch((error) => {
      throw error instanceof NotFoundError ? error : new SystemError("Error en MongoDB");
    });
};
