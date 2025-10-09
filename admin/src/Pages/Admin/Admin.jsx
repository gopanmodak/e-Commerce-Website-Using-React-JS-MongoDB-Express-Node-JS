
import React, { useState } from "react";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./Admin.css";

const Admin = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Function to trigger product list refresh
  const handleProductAdded = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        {/* Add Product Form */}
        <AddProduct onProductAdded={handleProductAdded} />

        {/* Product List */}
        <ListProduct refreshFlag={refreshFlag} />
      </div>
    </div>
  );
};

export default Admin;
