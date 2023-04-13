import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Profile,
  CreateProduct,
  SingleProductView,
  EditProduct,
  AdminPanel,
  Cart,
  SearchResults,
  Checkout,
  Confirmation,
} from "./pages";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Navbar, Footer, Gradient } from "./components";
import { createPaymentIntent } from "./api-adapters/stripe";
import { getActiveCartProductsDB } from "./api-adapters/carts";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [cartProductsCount, setCartProductsCount] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const stripePromise = loadStripe(
    "pk_test_51MvOTQLhGAqNc30vaCPHwOYngRS0iERaK2A9QymnF3g6Y0VUDpNBiB5Wveb9Vt62YZ3NyXMWwjonuaKiOBHl4mZQ00gY6bvm8D"
  );
  const grabCartProducts = async () => {
    const data = await getActiveCartProductsDB();
    let tempSubTotal = 0;
    for (let i = 0; i < data.length; i++) {
      tempSubTotal += data[i].product.price * data[i].quantity;
    }
    setSubTotal(tempSubTotal / 100);
    setCartProductsCount(data.length);
  };

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    const localStorageUsername = localStorage.getItem("username");

    if (localStorageToken && localStorageUsername) {
      setIsLoggedIn(true);
    }

    createPaymentIntent().then((data) => {
      setClientSecret(data.clientSecret);
    });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div id="main">
      <div id="gradient-container" className="w-full h-1 relative">
        <Gradient />
      </div>
      <div id="navbar-container mb-10">
        <Navbar
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          subTotal={subTotal}
          cartProductsCount={cartProductsCount}
          grabCartProducts={grabCartProducts}
        />
      </div>

      <div id="content">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                grabCartProducts={grabCartProducts}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route
            path="/product-view/:productId"
            element={<SingleProductView grabCartProducts={grabCartProducts} />}
          />
          <Route path="/:username/profile" element={<Profile />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route
            path="/panel"
            element={
              <AdminPanel isLoading={isLoading} setIsLoading={setIsLoading} />
            }
          />
          <Route
            path="/my-cart"
            element={
              <Cart
                subTotal={subTotal}
                grabCartProducts={grabCartProducts}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
          <Route
            path="/search-results/:searchInput"
            element={
              <SearchResults
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <Checkout />
                </Elements>
              )
            }
          />
          <Route path="/confirmation/:cartNumber" element={<Confirmation />} />
        </Routes>
      </div>
      <div id="gradient-container" className="w-full h-1 relative">
        <Gradient reverse />
      </div>
      <Footer />
      <div id="gradient-container" className="w-full h-1 relative">
        <Gradient />
      </div>
    </div>
  );
};

export default App;
