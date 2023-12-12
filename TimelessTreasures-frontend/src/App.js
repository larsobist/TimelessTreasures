import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLoadScript } from "@react-google-maps/api";

import logo from './Logo.png';
import menu from './Menu.png';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import EventBus from "./common/EventBus";
import AuthService from "./services/AuthService";

import Home from "./components/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import RegisterMod from "./components/User/RegisterMod";
import AccessoryAdd from "./components/Accessory/AccessoryAdd";
import AccessoryEdit from "./components/Accessory/AccessoryEdit.js";
import AccessoriesList from "./components/Accessory/AccessoriesList";
import AccessoriesListMod from "./components/Accessory/AccessoriesListMod";
import AccessoryDetail from "./components/Accessory/AccessoryDetail";
import AccessoryBought from "./components/Accessory/AccessoryBought";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  // Menü Responsive
  const [isCollapsed, setIsCollapsed] = useState(true);
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Maps deps
  useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Paypal deps and options
  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "EUR",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        <nav className="navbar fixed-top navbar-expand-lg">
          <Link to={"/"} className="navbar-brand">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            style={{ padding: "none" }}
            type="button"
            onClick={handleToggleCollapse}
          >
            <img src={menu} className="App-logo" alt="menu" />
          </button>
          <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}>
            <div className="navbar-nav mr-auto">
              {currentUser && (
                <li className="nav-item">
                  <Link to={"/add"} className="nav-link" onClick={handleToggleCollapse}>
                    Inserat erstellen
                  </Link>
                </li>
              )}
              <div className="navbar-nav mr-auto">
                {showModeratorBoard && (
                  <li className="nav-item">
                    <Link to={"/mod"} className="nav-link" onClick={handleToggleCollapse}>
                      Inserat freischalten
                    </Link>
                  </li>
                )}

                {showAdminBoard && (
                  <li className="nav-item">
                    <Link to={"/registerMod"} className="nav-link" onClick={handleToggleCollapse}>
                      Erstelle Moderator
                    </Link>
                  </li>
                )}
              </div>
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/accessorylist"} className="nav-link" onClick={handleToggleCollapse}>
                    Inseratverwaltung
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/" className="nav-link" onClick={logOut}>
                    Logout
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link" onClick={handleToggleCollapse}>
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link" onClick={handleToggleCollapse}>
                    Registrieren
                  </Link>
                </li>
              </div>
            )}
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mod" element={<AccessoriesListMod />} />
            <Route path="/registerMod" element={<RegisterMod />} />
            <Route path="/" element={<Home />} />
            <Route path="/accessorylist" element={<AccessoriesList />} />
            <Route path="/add" element={<AccessoryAdd />} />
            <Route path="/accessories/:id" element={<AccessoryEdit />} />
            <Route path="/accessory/:id" element={<AccessoryDetail />} />
            <Route path="/success/:id" element={<AccessoryBought />} />
          </Routes>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default App;