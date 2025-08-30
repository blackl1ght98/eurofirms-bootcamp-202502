import { User, Order } from "../../data/index.js";
import { validate, NotFoundError, SystemError } from "com";

export const getCartItems = (userId) => {
  validate.userId(userId);

  return User.findById(userId)
    .catch((error) => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) throw new NotFoundError("user not found");

      return Order.findOne({ user: userId, stateOrder: "cart", isCar: true }, "-__v")
        .lean()
        .populate({
          path: "products.product",
          select: "name description price stock image _id",
        })
        .populate({
          path: "user",
          select: "fullName",
        })
        .catch((error) => {
          throw new SystemError("mongo error");
        })
        .then((order) => {
          if (!order) return null;
          return {
            orderId: order._id.toString(),
            numberOrder: order.numberOrder,
            dateOrder: order.dateOrder,
            stateOrder: order.stateOrder,
            total: order.total,
            saleId: order.saleId,
            currency: order.currency,
            pagoId: order.pagoId,
            isCar: order.isCar,
            user: order.user ? order.user.fullName : null,
            products: (order.products || []).map((item) => ({
              cartItemId: item._id.toString(),
              product: item.product
                ? {
                    productId: item.product._id.toString(),
                    name: item.product.name,
                    description: item.product.description,
                    price: item.product.price,
                    stock: item.product.stock,
                    quantity: item.quantity,
                    priceAtOrderTime: item.priceAtOrderTime,
                  }
                : null,
            })),
          };
        });
    });
};
