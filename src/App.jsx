import Login from "./component/login/Login"
import Register from "./component/register/Register";
import Navbar from "./component/navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { Route,Routes, BrowserRouter } from "react-router-dom"
import Store from "./component/store/Store";

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<h1>home</h1>} />
          <Route path="/store" element={<Store></Store>} />
          <Route path="/contact" element={<h1>contact</h1>} />
          <Route path="/team" element={<h1>team</h1>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/login-register" element={<Register></Register>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
