const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    let newId;
    const carts = await this.readFiles();

    if (!carts.length) {
      newId = 1;
    } else {
      const lastCart = carts[carts.length - 1];
      newId = lastCart.id + 1;
    }
    const newCart = {
      id: newId,
      products: [],
    };
    carts.push(newCart);

    await this.saveFiles(carts);
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      if (res) {
        const arrayCarritos = JSON.parse(res);
        return arrayCarritos;
      } else {
        return [];
      }
    } catch (error) {
      console.log("no se pudo leer ", error);
    }
  }
  async saveFiles(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.log("no se pudo guardar el archivo", error);
    }
  }

  async getCartById(cartId) {
    try {
      const selectedCart = await this.readFiles();
      const res = selectedCart.find((item) => item.id === cartId);
      if (res) {
        console.log(" carrito encontrado!");
        return res;
      } else {
        console.log("no se encontro");
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async addProducts(cartId, productId, quantity = 1) {
    try {
      const selectedCart = await this.getCartById(cartId);

      const existingProduct = selectedCart.products.find(
        (product) => product.id === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        selectedCart.products.push({ id: productId, quantity });
      }
      const carts = await this.readFiles();
      const index = carts.findIndex((cart) => cart.id === selectedCart.id);

      carts[index] = selectedCart;
      await this.saveFiles(carts);
      return selectedCart;
    } catch (error) {
      console.log("error al agregar el producto", error);
    }
  }
}

module.exports = CartManager;
