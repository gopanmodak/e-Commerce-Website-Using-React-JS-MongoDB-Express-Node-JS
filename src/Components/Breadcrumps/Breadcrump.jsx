import React from 'react'
import './Breadcrump.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
const Breadcrump = (props) => {

    const {product}=props;
  return (
    <div className='breadcrump'>
    Home <img src={arrow_icon} alt="" /> Shop <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" />{product.name}
    </div>
  )
}

export default Breadcrump;
