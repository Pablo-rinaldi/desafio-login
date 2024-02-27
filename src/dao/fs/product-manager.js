const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(newObject) {
    let { title, description, price, img, code, stock, category } = newObject;

    const products = await this.getProducts();

    if (!title || !description || !price || !code || !stock || !category) {
      console.log("Faltan ingresar datos");
      return;
    }
    if (products && products.some((prod) => prod.code === code)) {
      console.log("No se puede agregar, Ya existe un producto con ese codigo");
      return;
    }

    let newId;

    if (!products.length) {
      newId = 1;
    } else {
      const lastProduct = products[products.length - 1];

      newId = lastProduct.id + 1;
    }

    const newProduct = {
      id: newId,
      title,
      description,
      price,
      img,
      code,
      stock,
      status: true,
      category,
    };

    if (products) {
      products.push(newProduct);
    }

    await this.saveFiles(products);
  }

  async getProducts() {
    try {
      const products = await this.readFiles();

      return products ?? [];
    } catch (error) {
      console.log("no se pudo leer una chota");
    }
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      if (res) {
        const arrayProductos = JSON.parse(res);
        return arrayProductos;
      } else {
        return [];
      }
    } catch (error) {
      console.log("no se pudo leer ", error);
    }
  }

  async saveFiles(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("no se pudo guardar el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.readFiles();
      const res = arrayProductos.find((item) => item.id === id);
      if (res) {
        console.log("encontrado!", res);
        return res;
      } else {
        console.log("no se encontro");
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        const oldProduct = arrayProductos[index];

        arrayProductos[index] = {
          id,
          title: updatedProduct.title ?? oldProduct.title,
          description: updatedProduct.description ?? oldProduct.description,
          price: updatedProduct.price ?? oldProduct.price,
          img: updatedProduct.img ?? oldProduct.img,
          code: updatedProduct.code ?? oldProduct.code,
          stock: updatedProduct.stock ?? oldProduct.stock,
          status: true,
          category: updatedProduct.category ?? oldProduct.category,
        };

        await this.saveFiles(arrayProductos);
        console.log("se actualizo");
      } else {
        console.log("no se encontro el producto");
      }
    } catch (error) {
      console.log("error al actualizar", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newProducts = arrayProductos.filter(
          (product) => product.id !== id
        );

        await this.saveFiles(newProducts);
        console.log("se elimino");
      } else {
        console.log("no se encontro el id del producto");
      }
    } catch (error) {
      console.log("Error al borrar");
    }
  }
}

module.exports = ProductManager;
