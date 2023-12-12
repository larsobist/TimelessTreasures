import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";

// register
const register = (username, email, password, roles) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    roles,
  });
};

// Login
const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

// Logout
const logout = () => {
  localStorage.removeItem("user");
};

// current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;