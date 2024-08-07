import Login from "./component/login/Login";
import Register from "./component/register/Register";
import Navbar from "./component/navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import "./app.css";
import HomePage from "./pages/HomePage";
import { Route, Routes, BrowserRouter } from "react-router-dom"
import ForgotPassword from "./component/forgotPassword/ForgotPassword";
import ResetPassword from "./component/forgotPassword/ResetPassword";
import ConfigurationUser from "./component/configurationUser/ConfigurationUser";
import { ProtectedRouterIfNotUser, ProtectedRouterIfUser } from "./component/utils/ProtectedRoute";
import UserPublications from "./component/userPublications/UserPublications";
import UserOrder from "./component/userOrder/UserOrder";
import Store from "./component/store/Store";
import UserProduct from "./component/product/userProduct";
import Cart from "./component/cart/Cart";
import ProductPage from "./component/userPublications/productPage/ProductPage";
import AddressForm from "./component/adressForm/AddressForm";
import BuyProduct from "./component/adressForm/BuyProduct";
import Favorites from "./component/favorites/Favorites";
import RatingForm from "./component/ratingForm/RatingForm";
import Footer from "./component/footer/Footer";
import Sales from "./component/sales/Sales";
import Ourteam from "./component/team/OurTeam";
import Form from "./component/form/Form";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <CartProvider>
    <UserProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<Store></Store>} />
          <Route path="/contact" element={<Form />} />
          <Route path="/team" element={<Ourteam />} />
          <Route path="/product/:productId" element={<ProductPage></ProductPage>} />


          <Route element={<ProtectedRouterIfUser redirectPath="/" />}>
            <Route path="/login" element={<Login></Login>} />
            <Route path="/login-register" element={<Register></Register>} />
            <Route path="/reset-password" element={<ResetPassword></ResetPassword>} />
            <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
          </Route>




          <Route element={<ProtectedRouterIfNotUser redirectPath="/login" />}>
          <Route path="/favorites" element={<Favorites />} />
            <Route path="/sales" element={<Sales/>} />
            <Route path="/buyProduct" element={<BuyProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sell" element={<UserProduct />} />
            <Route path="/configuration-user" element={<ConfigurationUser></ConfigurationUser>} />
            <Route path="/publications-user" element={<UserPublications></UserPublications>} />
            <Route path="/orders-user" element={<UserOrder></UserOrder>} />
          </Route>

        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </UserProvider>
    </CartProvider>
  );
}

export default App;
