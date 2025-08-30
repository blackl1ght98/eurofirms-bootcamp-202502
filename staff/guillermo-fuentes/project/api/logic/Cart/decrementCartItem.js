import { Order, Product, User } from "../../data/index.js";
import { validate, NotFoundError, SystemError } from "com";

export const decrementCartItem = (userId, cartItemId) => {
  validate.id(cartItemId, "cartItemId");

  return User.findById(userId)
    .catch(() => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) throw new NotFoundError("user not found");

      return Order.findOne({ "products._id": cartItemId, stateOrder: "cart", isCar: true }).then((cart) => {
        if (!cart) {
          throw new NotFoundError("cart not found");
        }

        const item = cart.products.id(cartItemId);
        if (!item) {
          throw new NotFoundError("Item not found");
        }

        return Product.findById(item.product).then((product) => {
          if (!product) {
            throw new NotFoundError("product not found");
          }

          // Reducir cantidad
          item.quantity -= 1;

          // Si la cantidad es 0 o menos, eliminar del carrito
          if (item.quantity <= 0) {
            cart.products.pull({ _id: cartItemId });
          }

          // Recalcular total
          cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

          // Aumentar stock y guardar carrito
          return product.updateOne({ $inc: { stock: 1 } }).then(() => cart.save());
        });
      });
    })
    .catch((error) => {
      throw error instanceof NotFoundError ? error : new SystemError("Error en MongoDB");
    });
};
