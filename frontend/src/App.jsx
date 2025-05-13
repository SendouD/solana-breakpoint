import { useEffect, useState } from 'react';
import {usePrivy} from '@privy-io/react-auth';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"
import CompanyRegistration from "./components/CompanyRegistration"
import AddProduct from "./components/AddProduct"
import Home from "./components/Home"
import ProductDisplay from './components/ProductsDisplay';
import LandingPage from './components/landingPage';
import { Header } from './components/c/header';
import LoginPage from './LoginPage';
import Campaigns from './components/Campaigns';

const App = () => {
  return (
    <Router>
        <Header/>
        <main>
          <Routes>
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/register-company" element={<CompanyRegistration />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product-display" element={<ProductDisplay />} />
            <Route path='/Login' element={<LoginPage/>}/>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>
    </Router>
  )
}

export default App