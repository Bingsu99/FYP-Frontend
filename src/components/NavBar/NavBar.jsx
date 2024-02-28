import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import links from "./NavBarConfig"
import AuthContext from "../../context/AuthContext";

const Navbar = ({ user }) => {
  const { logout } = useContext(AuthContext);
  let navigate = useNavigate();

  const onLogout = () => {
    logout(user);
    navigate('/login');
  };
  
  return (
    <div className="bg-white text-blue-400 w-full h-full flex flex-col rounded-lg">
        <ul>
          {links[user].map((link, index) => (
            <li key={index} className="flex items-center justify-center rounded-lg hover:bg-blue-100">
              <Link to={link.path} className="block py-2.5 px-4 rounded sm:text-base md:text-lg">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      <button 
        onClick={onLogout} 
        className="mt-auto mx-auto mb-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base md:text-lg rounded-lg w-5/6"
      >
        Logout
      </button>
    </div>
  );
};


export default Navbar;
