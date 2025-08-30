import { Router } from "express";
import { jsonBodyParser } from "../middlewares/jsonBodyParser.js";
import { logic } from "../logic/index.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export const cartRouter = Router();
cartRouter.get("/", (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);

    logic
      .getCartItems(userId)
      .then((orders) => response.status(200).json(orders))
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/add", jsonBodyParser, (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);
    const { productId, quantity } = request.body;
    logic
      .addToCart(userId, productId, quantity)
      .then(() => response.status(201).json())
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});
cartRouter.post("/checkout", (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);

    logic
      .checkoutCart(userId)
      .then(() => response.status(201).json())
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});
cartRouter.put("/item/:cartItemId/increment", (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);
    const { cartItemId } = req.params;
    logic
      .incrementCartItem(userId, cartItemId)
      .then(() => response.status(200).json())
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});
cartRouter.put("/item/:cartItemId/decrement", (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);
    const { cartItemId } = req.params;
    logic
      .decrementCartItem(userId, cartItemId)
      .then(() => response.status(200).json())
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});
cartRouter.delete("/item/:cartItemId", (request, response, next) => {
  try {
    // Verificar autenticación
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ValidationError("Token de autenticación no proporcionado");
    }

    const token = authorization.slice(7);
    const { sub: userId } = jwt.verify(token, JWT_SECRET);
    const { cartItemId } = request.params;
    logic
      .removeCartItem(userId, cartItemId)
      .then(() => response.status(204).json())
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
});
