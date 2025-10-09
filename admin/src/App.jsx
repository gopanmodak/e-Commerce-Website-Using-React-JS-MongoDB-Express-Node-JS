import React, { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import AddProduct from "./Components/AddProduct/AddProduct";
import ListProduct from "./Components/ListProduct/ListProduct";
import "./App.css";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshProducts = () => setRefreshFlag(!refreshFlag);

  return (
    <div className="App">
      <Navbar />
      <div className="dashboard">
        <AddProduct onProductAdded={refreshProducts} />
        <ListProduct refreshFlag={refreshFlag} />
      </div>
    </div>
  );
}

export default App;
