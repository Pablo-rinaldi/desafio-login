const express = require("express");

const router = express.Router();

const CartModel = require("../dao/models/cart.model.js");

const CartManager = require("../dao/db/cart-manager-db.js");

const manager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/:cid", async (req, res) => {
  let cartId = req.params.cid;

  try {
    const selectedCart = await manager.getCartById(cartId);

    if (selectedCart) {
      res.send(selectedCart);
    } else {
      res.send("Carrito no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updatedCart = await manager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updatedCart.products);
  } catch (error) {
    console.error("Error al agregar al carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await CartModel.findById(cartId);
    if (cart) {
      const filteredProds = cart.products.filter((item) => {
        return item.product.toString() !== productId;
      });

      cart.products = filteredProds;
      await CartModel.findByIdAndUpdate(cartId, cart);
    }
    res.send("success");
  } catch (error) {
    console.error("Error al agregar al eliminar", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    await CartModel.findByIdAndUpdate(cartId, { products: [] });
    res.send("success");
  } catch (error) {
    console.error("Error al eliminar", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const productId = req.params.pid;
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId);

    const product = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (product) {
      product.quantity = quantity;
      cart.save();
    }
    res.send("success");
  } catch (error) {
    console.error("Error al actualizar la cantidad", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
