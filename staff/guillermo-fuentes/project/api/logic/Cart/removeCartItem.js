import { User, Order, Product } from "../../data/index.js";
import { validate, NotFoundError, SystemError, ValidationError } from "com";

export const removeCartItem = (userId, cartItemId) => {
  validate.userId(userId);
  validate.productId(cartItemId);

  return User.findById(userId)
    .catch(() => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("user not found");
      }

      return Order.findOne({ "products._id": cartItemId, stateOrder: "cart", isCar: true })
        .catch(() => {
          throw new SystemError("mongo error");
        })
        .then((cart) => {
          if (!cart) {
            throw new NotFoundError("Product is not in the cart");
          }

          const item = cart.products.id(cartItemId);
          if (!item) {
            error("Product is not in the cart");
          }

          return Product.findById(item.product)
            .catch(() => {
              throw new SystemError("mongo error");
            })
            .then((product) => {
              if (!product) {
                throw new NotFoundError("Product not found");
              }

              product.stock += item.quantity;
              //método de Mongoose (usado en MongoDB) que elimina un elemento de un array embebido dentro de un documento.
              cart.products.pull({ _id: cartItemId });

              // Calcula el total del carrito sumando (cantidad × precio) de cada producto
              cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

              return product.updateOne({ $set: { stock: product.stock } }).then(() => {
                if (cart.products.length === 0) {
                  return cart.deleteOne();
                }
                return cart.save();
              });
            });
        });
    })
    .catch((error) => {
      throw error instanceof NotFoundError || error instanceof ValidationError ? error : new SystemError("mongo error");
    });
};
