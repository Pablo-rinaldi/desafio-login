const CartModel = require("../models/cart.model.js");

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("No se pudo crear el carrito");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate(
        "products.product"
      );

      if (cart) {
        console.log("Se encontro el carrito");
        return cart;
      } else {
        console.log("no se encontro el carrito");
        return null;
      }
    } catch (error) {
      console.log("no se encontro el carrito", error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const exist = cart.products.find(
        (item) => item.product.toString() === productId
      );
      if (exist) {
        exist.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("error al agregar un producto", error);
    }
  }
}
module.exports = CartManager;
