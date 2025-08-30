import { connect, disconnect } from "../../data/index.js";
import { searchProducts } from "./searchProduct.js";

connect("mongodb://localhost:27017/proyectoFinal")
  .then(() => {
    try {
      return searchProducts("6873f0f152ec79b950c77cc9", "Prueba desde Front")
        .then((product) => console.debug("Product found", product))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  })
  .catch((error) => console.error(error))
  .finally(() => disconnect());
