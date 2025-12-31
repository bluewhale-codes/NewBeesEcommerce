import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Pages/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import ProfilePage from './Pages/ProfilePage'
import HomeBanner from './Components/HomeBanner'
import Home from './Pages/Home'
import NewProduct from './Pages/NewProduct'
import Product from './Pages/Product'
import ProductCard from './Products/ProductCard'
import ProductPage from './Products/ProductListPage'
import ProductListingPage from './Products/ProductListPage'
import ShoppingCart from './Components/ShoppingCart'
import DigitalAssistant from './PersonalAssistant/DigitalAssistant'
const products = [
    {
      id: 1,
      name: 'ADRO T Shirts Pack of 2 Mens Tshirts Oversized T Shirts for Men Tshirt T-Shirts',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695036716/products/pukgc468gfkgzousnjlc.jpg',
      price: 1999,
      originalPrice: 699,
      rating: 4,
      category: 'Clothes'
    },
    {
      id: 2,
      name: 'SPARX Mens Sx0875g Walking',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704850/products/te5jo9bwoh1awo5ev39w.jpg',
      price: 799,
      originalPrice: 999,
      rating: 0,
      category: 'Shoose'
    },
    {
      id: 3,
      name: 'ColorChakra Mens Waffle Knit Polo Tshirt Collar Knitted Shirt for Men M to 3XL',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704701/products/wz6d0tlhdhup7lrt8apa.avif',
      price: 889,
      originalPrice: 1299,
      rating: 0,
      category: 'Clothes'
    },
    {
      id: 4,
      name: 'ADRO T-Shirts for Men | Chest Printed Tshirt for Men | Cotton Tshirt for',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704505/products/l7cyjcv8vqkl8poy2xad.avif',
      price: 2333,
      originalPrice: 5999,
      rating: 0,
      category: 'Clothes'
    },
    {
      id: 5,
      name: 'JVX Men Oversized Tshirt || T Shirt for Men || Men T Shirt Printed (MOT-101)',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704592/products/kfaryytlgkv4bp3j0a16.avif',
      price: 788,
      originalPrice: 999,
      rating: 0,
      category: 'Clothes'
    }
]
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
    <BrowserRouter>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/new" element={<NewProduct/>} />
        <Route path="/productList" element={<ProductListingPage products={products}/>} />
        <Route path="/cart" element={<ShoppingCart/>} />
        <Route path="/" element={<DigitalAssistant/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
