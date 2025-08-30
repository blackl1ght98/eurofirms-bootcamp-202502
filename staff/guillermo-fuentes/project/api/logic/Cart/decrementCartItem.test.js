import { connect, disconnect } from "../../data/index.js";
import { decrementCartItem } from "./decrementCartItem.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    return decrementCartItem("6873f0f152ec79b950c77cc9", "68b3309927c522c4407eef84")
      .then(() => console.debug("decremento exitoso"))
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
