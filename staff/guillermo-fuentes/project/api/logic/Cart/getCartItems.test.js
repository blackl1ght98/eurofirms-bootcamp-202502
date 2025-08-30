import { connect, disconnect } from "../../data/index.js";
import { getCartItems } from "./getCartItems.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    return getCartItems("6873f0f152ec79b950c77cc9")
      .then((items) => console.debug("Items in cart", items))
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
