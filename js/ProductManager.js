import axios from "axios";
import Product from "./Product";

function ProductManager(){
    this.products = []
}

ProductManager.prototype.getProducts = async function () {
    try {
      // Call API lấy danh sách sản phẩm
      const result = await axios.get(
        "https://624aa9dd852fe6ebf8898954.mockapi.io/ngoc/product"
      );
  
      this.products = result.data.map((item) => {
        const product = new Product(
            item.id,
            item.name,
            item.img,
            item.price,
            item.type
        );
  
        return product;
      });
    } catch (error) {
      console.log(error.response.data);
      alert("Cannot get product list");
    }
  };
  
  ProductManager.prototype.getProductById = function (productID) {
    return axios.get(
      `https://624aa9dd852fe6ebf8898954.mockapi.io/ngoc/product/${productID}`
    );
  };
  
  ProductManager.prototype.createProduct = async function (product) {
    // Gọi API thêm sản phẩm
    await axios.post(
      "https://624aa9dd852fe6ebf8898954.mockapi.io/ngoc/product",
      product
    );
  
    // Thêm thành công => gọi API lấy danh sách sản phẩm
    this.getProducts();
  };
  
  ProductManager.prototype.updateProduct = function (productID, product) {
    return axios
      .put(
        `https://624aa9dd852fe6ebf8898954.mockapi.io/ngoc/product/${productID}`,
        product
      )
      .then(() => {
        // Cập nhật thành công => gọi API lấy danh sách sản phẩm
        return this.getProducts();
      });
  };
  
  ProductManager.prototype.deleteProduct = function (productID) {
    return axios
      .delete(
        `https://624aa9dd852fe6ebf8898954.mockapi.io/ngoc/product/${productID}`
      )
      .then(() => {
        return this.getProducts();
      });
  };
  

export  default ProductManager