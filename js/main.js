import ProductManager from "./ProductManager";
import Product from "./Product";
const productList = new ProductManager();

init();
function init() {
  // hiện thị ra table
  productList.getProducts().then(() => {
    // Hiển thị products ra table
    console.log(productList.products);
    display(productList.products);
  });
}

function display(products) {
  const html = products.reduce((result, product) => {
    return (
      result +
      `
      <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
          <img src="${product.img}" width="50" height="50" />
        </td>
        <td>${product.type}</td>
        <td>
          <button
            class="btn btn-primary"
            data-id="${product.id}"
            data-type="update"
            data-toggle="modal"
            data-target="#myModal"
          >
            Update
          </button>

          <button
            class="btn btn-danger"
            data-id="${product.id}"
            data-type="delete"
          >
            Delete
          </button>
        </td>
      </tr>
    `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// Xử lý nút Thêm SP để cập nhật giao diện cho modal
document.getElementById("btnThemSP").addEventListener("click", () => {
  // Xử lý thay đổi heading và thêm button
  document.querySelector(".modal-title").innerHTML = "Thêm Sản Phẩm";
  document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
    <button id="btnCreate" class="btn btn-success">Thêm</button>
  `;
});

// lắng nghe button Thêm/Cập Nhật
document.querySelector(".modal-footer").addEventListener("click", (event) => {
  // DOM tới input để lấy value
  const name = document.getElementById("TenSP").value;
  const price = +document.getElementById("GiaSP").value;
  const img = document.getElementById("HinhSP").value;
  const  type = document.getElementById("loaiSP").value;

  const product = new Product("",name,img,price,type);

  const targetEl = event.target;
  if (targetEl.id === "btnCreate") {
    productList.createProduct(product).then(() => {
      // Lấy danh sách sản phẩm thành công => hiển thị ra giao diện
      init()
      // Đóng modal
      $('#myModal').modal('hide')
    });
  }

  if (targetEl.id === "btnUpdate") {
    const productID = document.getElementById("MaSP").value;
    productList.updateProduct(productID, product).then(() => {
      display(productList.products);
      // Đóng modal
      $('#myModal').modal('hide')
    });
  }
});

// Xử lý DOM tới tbody để lắng nghe button Update/Delete
document.getElementById("tblDanhSachSP").addEventListener("click", (event) => {
  const targetEl = event.target;

  const id = targetEl.getAttribute("data-id")
  const type = targetEl.getAttribute("data-type");

  if (type === "delete") {
    productList.deleteProduct(id).then(() => {
      // Sau khi gọi API xoá thành công và gọi lại api lấy danh sách sản phẩm thành công
      display(productList.products);
    });
  }

  if (type === "update") {
    // Cập nhật giao diện cho Modal
    document.querySelector(".modal-title").innerHTML = "Cập nhật Sản Phẩm";
    document.querySelector(".modal-footer").innerHTML = `
      <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
      <button id="btnUpdate" class="btn btn-success">Cập Nhật</button>
    `;

    // Gọi API lấy chi tiết sản phẩm bằng id
    productList.getProductById(id).then((result) => {
      // Đổ data của sản phẩm cần cập nhật lên form
      document.getElementById("MaSP").value = id;
      document.getElementById("TenSP").value = result.data.name;
      document.getElementById("GiaSP").value = result.data.price;
      document.getElementById("HinhSP").value = result.data.image;
      document.getElementById("MotaSP").value = result.data.description;
    });
  }
});