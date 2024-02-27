const ProductModel = require("../models/product.model.js");

class ProductManager {
  async addProduct(newObject) {
    try {
      let {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        thumbnails,
      } = newObject;

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Faltan ingresar datos");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El codigo ya esta usado, ingresa otro");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        status: true,
        category,
        thumbnails: thumbnails || [],
      });
      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar producto", error);
    }
  }

  async getProducts(limit, page, category, sort) {
    try {
      const products = await ProductModel.paginate(
        category ? { category } : {},
        { limit, page, sort: sort ? { price: sort } : {} }
      );

      return products;
    } catch (error) {
      console.log("no se pudieron leer los productos", error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (product) {
        console.log("encontrado!", product);
        return product;
      } else {
        console.log("no se encontro");
        return null;
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, updatedProduct);

      if (!product) {
        console.log("no se encontro el producto");
        return null;
      } else {
        console.log("Producto actualizado con exito");
        return product;
      }
    } catch (error) {
      console.log("error al actualizar", error);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (deletedProduct) {
        console.log("se borro el producto");
      } else {
        console.log("No se encontro el producto a eliminar");
        return null;
      }
    } catch (error) {
      console.log("Error al borrar el producto");
    }
  }
}

module.exports = ProductManager;
