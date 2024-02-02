import logo from "../img/prime-logo.png";
import { FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoIosHelpCircle, IoMdInformationCircle } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function SideBar() {
  return (
    <header>
      <img src={logo} alt="logo" className="w-[3rem]" />
      <div className="top-menu">
        <div className="side-icon">
          <Link to="/home">
            <MdDashboard title="Order" />
          </Link>
        </div>
        <div className="side-icon">
          <Link to="/about">
            <IoMdInformationCircle title="About" />
          </Link>
        </div>
        <div className="side-icon">
          <Link to="/profile">
            <FaUser title="Your Profile" />
          </Link>
        </div>
        <div className="side-icon">
          <Link to="/settings">
            <FaCog title="Settings" />
          </Link>
        </div>
        <div className="side-icon">
          <Link to="/help">
            <IoIosHelpCircle title="FAQs" />
          </Link>
        </div>
      </div>
      <div className="bottom-menu">
        <Link to="/">
          <FaSignOutAlt title="Logout" />
        </Link>
      </div>
    </header>
  );
}

export default SideBar;
