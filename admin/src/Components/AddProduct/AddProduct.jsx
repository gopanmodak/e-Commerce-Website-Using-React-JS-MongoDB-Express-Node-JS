import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = ({ onProductAdded }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    old_price: "",
    new_price: "",
  });

  // Handle image selection
  const imageHandler = (e) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  // Handle input changes
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Submit new product
  const addProduct = async () => {
    const { name, old_price, new_price } = productDetails;
    if (!name || !image) return alert("Enter product name and select an image");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("category", productDetails.category);
      formData.append("old_price", old_price);
      formData.append("new_price", new_price);

      const res = await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert("Product added successfully!");
        setProductDetails({ name: "", category: "women", old_price: "", new_price: "" });
        setImage(null);
        onProductAdded(); // Trigger refresh in product list
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addproduct">
      <h3>Add Product</h3>

      <input
        type="text"
        placeholder="Product Name"
        name="name"
        value={productDetails.name}
        onChange={changeHandler}
      />
      <input
        type="number"
        placeholder="Old Price"
        name="old_price"
        value={productDetails.old_price}
        onChange={changeHandler}
      />
      <input
        type="number"
        placeholder="New Price"
        name="new_price"
        value={productDetails.new_price}
        onChange={changeHandler}
      />

      <select name="category" value={productDetails.category} onChange={changeHandler}>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kid">Kid</option>
      </select>

      <label htmlFor="fileInput" className="upload-label">
        <img
          src={image ? URL.createObjectURL(image) : upload_area}
          alt="Upload Preview"
          className="upload-preview"
        />
      </label>
      <input id="fileInput" type="file" accept="image/*" onChange={imageHandler} hidden />

      <button onClick={addProduct} disabled={loading}>
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;
