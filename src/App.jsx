import Login from "./component/login/Login";
import Register from "./component/register/Register";
import Navbar from "./component/navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./app.css";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<h1>store</h1>} />
          <Route path="/contact" element={<h1>contact</h1>} />
          <Route path="/team" element={<h1>team</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
