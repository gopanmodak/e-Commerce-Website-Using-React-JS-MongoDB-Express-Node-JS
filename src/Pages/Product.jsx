import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrump from '../Components/Breadcrumps/Breadcrump';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';

 const Product = () => {
  const{all_product}=useContext(ShopContext);

  const {productId}=useParams();
  const product=all_product.find((e)=>e.id===Number(productId));

  return (
    <div>
    <Breadcrump product={product}/>
    <ProductDisplay product={product}/>
    </div>
  )
}
export default Product
