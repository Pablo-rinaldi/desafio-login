const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 3;
    const category = req.query.category;
    const sort = req.query.sort;

    const products = await productManager.getProducts(
      limit,
      page,
      category,
      sort
    );

    const productsResultadoFinal = products.docs.map((prod) => {
      const { _id, ...rest } = prod.toObject();
      return rest;
    });

    res.render("products", {
      user: req.session.user,
      products: productsResultadoFinal,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080/products?page=${products.nextPage}`
        : null,
    });
  } catch (error) {
    console.log("no se pudo obtener los productos", error);
  }
});

router.get("/cart/:cid", async (req, res) => {
  let cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      const productsResultadoFinal = cart.products.map((prod) => {
        const { _id, ...rest } = prod.toObject();
        return rest;
      });
      console.log(productsResultadoFinal);
      res.render("cart", { products: productsResultadoFinal });
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
  }
});

router.get("/", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }

  res.render("login");
});

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }

  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }

  res.render("profile", { user: req.session.user });
});

module.exports = router;
