import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Shop from "./Components/Shop";
import Profile from "./Pages/Profile";
import Help from "./Pages/Help";
import Settings from "./Pages/Settings";
import NotFound from "./Pages/NotFound";
import About from "./Pages/About";
import AdminPanel from "./Pages/AdminPanel";
import "./App.css";
import AdminLogin from "./Pages/AdminLogin";

//hiiiii

const App = () => {
  return (
    <div className="App">
      <>
        <Router>
          <Routes>
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/adminpanel" element={<AdminPanel />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Shop />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </>
    </div>
  );
};

export default App;
