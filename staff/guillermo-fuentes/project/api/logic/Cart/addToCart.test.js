import { connect, disconnect } from "../../data/index.js";
import { addToCart } from "./addToCart.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    return addToCart("6873f0f152ec79b950c77cc9", "68755a8237606761ef88b37a", 2)
      .then(() => console.debug("Product add to cart"))
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
