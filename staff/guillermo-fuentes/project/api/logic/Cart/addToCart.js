import { User, Order, Product } from "../../data/index.js";
import { validate, NotFoundError, SystemError, ValidationError } from "com";

export const addToCart = (userId, productId, quantity) => {
  validate.userId(userId);
  validate.productId(productId);
  validate.quantity(quantity);

  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new ValidationError("The quantity must be a positive number");
  }

  return User.findById(userId)
    .catch((error) => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("user not found");
      }

      return Product.findById(productId)
        .catch((error) => {
          throw new SystemError("mongo error");
        })
        .then((product) => {
          if (!product) {
            throw new NotFoundError("Producto no encontrado");
          }
          if (product.stock < parsedQuantity) {
            throw new ValidationError("There is not enough stock");
          }

          // Calcular el nuevo stock
          product.stock -= parsedQuantity;

          return Order.findOne({ user: userId, stateOrder: "cart", isCar: true })
            .then((cart) => {
              if (!cart) {
                return Order.create({
                  user: userId,
                  numberOrder: `CART-${Date.now()}`,
                  dateOrder: new Date(),
                  stateOrder: "cart",
                  isCar: true,
                  total: parsedQuantity * product.price,
                  currency: "EUR",
                  products: [
                    {
                      product: productId,
                      quantity: parsedQuantity,
                      priceAtOrderTime: product.price,
                    },
                  ],
                }).then((created) => ({ cart: created, product }));
              }

              const existingProduct = cart.products.find((item) => item.product.toString() === productId);
              if (existingProduct) {
                existingProduct.quantity += parsedQuantity;
              } else {
                cart.products.push({
                  product: productId,
                  quantity: parsedQuantity,
                  priceAtOrderTime: product.price,
                });
              }

              cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

              return { cart, product };
            })
            .then(({ cart, product }) => {
              return product
                .updateOne({ $set: { stock: product.stock } })
                .catch((error) => {
                  throw new SystemError(`mongo error`);
                })
                .then((result) => {
                  console.debug("Stock update result:", result);
                  if (result.matchedCount === 0) {
                    throw new SystemError("The product to update stock was not found");
                  }
                  if (result.modifiedCount === 0) {
                    console.debug("Unmodified stock, possible stock equal to the previous one");
                  }
                  return cart.save();
                })
                .catch((error) => {
                  throw new SystemError(`mongo error`);
                });
            });
        });
    })
    .catch((error) => {
      throw error instanceof NotFoundError || error instanceof ValidationError ? error : new SystemError("mongo error");
    });
};
