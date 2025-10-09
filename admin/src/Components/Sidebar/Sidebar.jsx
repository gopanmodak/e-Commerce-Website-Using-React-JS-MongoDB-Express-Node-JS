import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import addProductIcon from '../../assets/Product_Cart.svg';
import listProductIcon from '../../assets/Product_list_icon.svg';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <Link to="/addproduct" className="sidebar-link">
        <div className="sidebar-item">
          <img src={addProductIcon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to="/listproduct" className="sidebar-link">
        <div className="sidebar-item">
          <img src={listProductIcon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
