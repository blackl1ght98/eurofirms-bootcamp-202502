import { Product, User } from "../../data/index.js";
import { NotFoundError, SystemError, validate } from "com";

export const searchProducts = (userId, query) => {
  validate.userId(userId);
  validate.query(query);

  return User.findById(userId)
    .catch((error) => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) throw new NotFoundError("user not found");

      return Product.find({ name: { $regex: query, $options: "i" } })
        .select("name _id")
        .lean()
        .catch((error) => {
          throw new SystemError("mongo error");
        })
        .then((products) => {
          products.forEach((product) => {
            product.id = product._id.toString();
            delete product._id;
            delete product.__v;
          });

          return products;
        });
    });
};
