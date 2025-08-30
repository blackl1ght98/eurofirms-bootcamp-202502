import { connect, disconnect } from "../../data/index.js";
import { checkoutCart } from "./checkoutCart.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    return checkoutCart("6873f0f152ec79b950c77cc9")
      .then(() => console.debug("checkout exitoso"))
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
