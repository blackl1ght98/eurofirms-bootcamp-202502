import { connect, disconnect } from "../../data/index.js";
import { removeCartItem } from "./removeCartItem.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    return removeCartItem("6873f0f152ec79b950c77cc9", "68b312207b1050e14720e678")
      .then(() => console.debug("Items removed"))
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
