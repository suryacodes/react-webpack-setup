import Dexie, { Table } from "dexie";

export interface Product {
  id?: number;
  serverDdId: number;
  name: string;
  img: string;
}

export interface ProductStock {
  id?: number;
  productId?: number;
  quantity: number;
}

export interface ProductData extends Product, ProductStock {}

class ProductDB extends Dexie {
  product!: Table<Product, number>;
  productstock!: Table<ProductStock, number>;

  constructor(private dbVersion: number = 3) {
    super("ProductDB");
    this.version(dbVersion)
      .stores({
        product: "++id, serverDdId, *name, img, weight",
        productstock: "++id, productId, quantity",
      })
      .upgrade((tx) => {
        return tx
          .table("product")
          .toCollection()
          .modify((product) => {
            product.weight = Math.floor(Math.random() * 100);
          });
      });
  }

  async addProduct(product: ProductData) {
    return this.transaction("rw", this.product, this.productstock, async () => {
      const productId = await this.product.add({
        serverDdId: product.serverDdId,
        name: product.name,
        img: product.img,
      });
      this.productstock.add({
        productId,
        quantity: product.quantity,
      });
    });
  }

  async updateProductQuantity(productId: number, newQuantity: number) {
    return this.productstock
      .where({ productId })
      .modify({ quantity: newQuantity });
  }

  async updateProductDetails(product: Product) {
    if (product.id === undefined) return;
    return this.product.update(product.id, product);
  }

  async deleteProduct(productId: number) {
    return this.transaction("rw", this.product, this.productstock, () => {
      this.product.delete(productId);
      this.productstock.where({ productId }).delete();
    });
  }

  async deleteAllProduct() {
    return this.transaction("rw", this.product, this.productstock, () => {
      this.product.clear();
      this.productstock.clear();
    });
  }

  async getProductDetail(productId: number) {
    return this.transaction("r", this.product, this.productstock, async () => {
      const product = await this.product.get(productId);
      const productStock = await this.productstock.where({ productId }).first();
      return { ...product, quanity: productStock?.quantity };
    });
  }

  async getProducts(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;

    return this.transaction("r", this.product, this.productstock, async () => {
      const productsWithPagination = await this.product
        .offset(offset)
        .limit(pageSize)
        .toArray();

      const productStockPromises = productsWithPagination.map(
        async (product) => {
          const productStock = await this.productstock
            .where({ productId: product.id })
            .first();
          return { ...product, quantity: productStock?.quantity };
        }
      );
      return Promise.all(productStockPromises);
    });
  }
}

export const productDB = new ProductDB();

productDB
  .open()
  .then(() => {
    console.log("Database opened successfully");
  })
  .catch((error) => {
    console.error("Error opening database:", error);
  });

export function generateRandomData() {
  // Define arrays of possible values for each property
  const names = [
    "fish curry",
    "chicken tikka",
    "vegetable biryani",
    "paneer tikka masala",
    "dal makhani",
  ];
  const images = [
    "https://via.placeholder.com/600/24f355",
    "https://via.placeholder.com/600/1ee8a4",
    "https://via.placeholder.com/600/949d9f",
    "https://via.placeholder.com/600/56a8c3",
    "https://via.placeholder.com/600/ff8a33",
  ];
  const serverIds = [987, 654, 321, 789, 123];

  // Generate random index for each array
  const randomNameIndex = Math.floor(Math.random() * names.length);
  const randomImageIndex = Math.floor(Math.random() * images.length);
  const randomServerIdIndex = Math.floor(Math.random() * serverIds.length);

  // Create an object with random properties
  const randomData = {
    name: names[randomNameIndex],
    img: images[randomImageIndex],
    serverDdId: serverIds[randomServerIdIndex],
    quantity: Math.floor(Math.random() * 100),
  };

  return randomData;
}
