import { Order, Product, User } from "../../data/index.js";
import { validate, NotFoundError, SystemError } from "com";

export const incrementCartItem = (userId, cartItemId) => {
  validate.id(cartItemId, "cartItemId");

  return User.findById(userId)
    .catch(() => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) throw new NotFoundError("user not found");

      return Order.findOne({ "products._id": cartItemId, stateOrder: "cart", isCar: true }).then((cart) => {
        if (!cart) {
          throw new NotFoundError("Producto no está en el carrito");
        }

        const item = cart.products.id(cartItemId);
        if (!item) {
          throw new NotFoundError("Producto no está en el carrito");
        }

        return Product.findById(item.product).then((product) => {
          if (!product) {
            throw new NotFoundError("Producto no encontrado");
          }
          if (product.stock <= 0) {
            throw new SystemError("No hay suficiente stock");
          }

          // Incrementamos cantidad en carrito
          item.quantity += 1;

          // Recalculamos total
          cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

          // Actualizamos stock y guardamos carrito
          return product.updateOne({ $inc: { stock: -1 } }).then(() => cart.save());
        });
      });
    })
    .catch((error) => {
      throw error instanceof NotFoundError ? error : new SystemError("Error en MongoDB");
    });
};
