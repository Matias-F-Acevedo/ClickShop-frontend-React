import Login from "./component/login/Login"
import Register from "./component/register/Register";
import Navbar from "./component/navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { Route,Routes, BrowserRouter } from "react-router-dom"
import ForgotPassword from "./component/forgotPassword/ForgotPassword";
import ResetPassword from "./component/forgotPassword/ResetPassword";

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<h1>home</h1>} />
          <Route path="/store" element={<h1>store</h1>} />
          <Route path="/contact" element={<h1>contact</h1>} />
          <Route path="/team" element={<h1>team</h1>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/login-register" element={<Register></Register>} />
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
          <Route path="/reset-password" element={<ResetPassword></ResetPassword>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
