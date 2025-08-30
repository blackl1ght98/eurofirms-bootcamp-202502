import mongoose from "mongoose";
import { Order, Product, User } from "../../data/index.js";
import { validate, NotFoundError, SystemError } from "com";

export const decrementCartItem = (userId, cartItemId) => {
  validate.id(cartItemId, "cartItemId");

  return mongoose.startSession().then((session) => {
    session.startTransaction();
    return User.findById(userId)
      .catch(() => {
        throw new SystemError("mongo error");
      })
      .then((user) => {
        if (!user) throw new NotFoundError("user not found");
        return Order.findOne({ "products._id": cartItemId, stateOrder: "cart", isCar: true }, null, {
          session,
        })
          .then((cart) => {
            if (!cart) {
              session.abortTransaction().finally(() => session.endSession());
              throw new NotFoundError("cart not found");
            }

            const item = cart.products.id(cartItemId);
            if (!item) {
              session.abortTransaction().finally(() => session.endSession());
              throw new NotFoundError("Item not found");
            }

            return Product.findById(item.product)
              .session(session)
              .then((product) => {
                if (!product) {
                  session.abortTransaction().finally(() => session.endSession());
                  throw new NotFoundError("product not found");
                }

                item.quantity -= 1;
                if (item.quantity <= 0) {
                  cart.products.pull({ _id: cartItemId });
                }

                cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

                return product.updateOne({ $inc: { stock: 1 } }, { session }).then(() => cart.save({ session }));
              });
          })
          .then((cart) => {
            return session.commitTransaction().then(() => cart);
          })
          .catch((error) => {
            session.abortTransaction().finally(() => session.endSession());
            throw error instanceof NotFoundError ? error : new SystemError("Error en MongoDB");
          })
          .finally(() => session.endSession());
      });
  });
};
