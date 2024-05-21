import Login from "./component/login/Login"
import Register from "./component/register/Register";
import Navbar from "./component/navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { Route, Routes, BrowserRouter } from "react-router-dom"
import ForgotPassword from "./component/forgotPassword/ForgotPassword";
import ResetPassword from "./component/forgotPassword/ResetPassword";
import ConfigurationUser from "./component/configurationUser/ConfigurationUser";
import { ProtectedRouterIfNotUser, ProtectedRouterIfUser } from "./component/utils/ProtectedRoute";
import UserPublications from "./component/userPublications/UserPublications";
import UserOrder from "./component/userOrder/UserOrder";
import Store from "./component/store/Store";
import UserProduct from "./component/product/userProduct";
import UpdateCard from "./component/userPublications/updateCard.jsx/UpdateCard";
import Cart from "./component/cart/Cart";

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>


          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/store" element={<Store></Store>} />
          <Route path="/contact" element={<h1>contact</h1>} />
          <Route path="/team" element={<h1>team</h1>} />
          <Route path="/test" element={<UpdateCard></UpdateCard>} />


          <Route element={<ProtectedRouterIfUser redirectPath="/" />}>
            <Route path="/login" element={<Login></Login>} />
            <Route path="/login-register" element={<Register></Register>} />
            <Route path="/reset-password" element={<ResetPassword></ResetPassword>} />
            <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
          </Route>




            <Route path="/sell" element={<UserProduct/>} />
          <Route element={<ProtectedRouterIfNotUser redirectPath="/login" />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/configuration-user" element={<ConfigurationUser></ConfigurationUser>} />
            <Route path="/publications-user" element={<UserPublications></UserPublications>} />
            <Route path="/orders-user" element={<UserOrder></UserOrder>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
