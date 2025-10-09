import React, { useEffect, useState } from "react";
import removeIcon from "../../assets/cross_icon.png";
import "./ListProduct.css";

const ListProduct = ({ refreshFlag }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/allproducts");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshFlag]); // Refresh list when new product is added

  // Remove product
  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;

    try {
      const res = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setAllProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product removed successfully!");
      } else {
        alert("Failed to remove product");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove product");
    }
  };

  return (
    <div className="listproduct">
      <h3>Product List</h3>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : allProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="listproduct-table">
          <div className="listproduct-header">
            <p>Image</p>
            <p>Name</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
          </div>

          {allProducts.map(
            ({ id, name, image, old_price, new_price, category }) => (
              <div key={id} className="listproduct-row">
                <img src={image} alt={name} className="product-image" />
                <p>{name}</p>
                <p>${old_price}</p>
                <p>${new_price}</p>
                <p>{category}</p>
                <img
                  src={removeIcon}
                  alt="Remove"
                  className="remove-icon"
                  onClick={() => removeProduct(id)}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ListProduct;
