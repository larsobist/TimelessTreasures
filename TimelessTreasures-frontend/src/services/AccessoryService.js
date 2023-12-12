import http from "../http-common";
import authHeader from "./AuthHeader";

// All data
const getAll = () => {
  return http.get("/accessories", { headers: authHeader() });
};

// Get one with id
const get = (id) => {
  return http.get(`/accessories/${id}`, { headers: authHeader() });
};

// create accessory
const create = (data) => {
  return http.post("/accessories", data, { headers: authHeader() });
};

// update accessory
const update = (id, data) => {
  return http.put(`/accessories/${id}`, data, { headers: authHeader() });
};

// delete accessory
const remove = (id) => {
  return http.delete(`/accessories/${id}`, { headers: authHeader() });
};

// delete all
const removeAll = () => {
  return http.delete(`/accessories`, { headers: authHeader() });
};

// find by title => not used anymore, only for testing
const findByTitle = (title) => {
  return http.get(`/accessories?title=${title}`, { headers: authHeader() });
};

const AccessorySservice = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default AccessorySservice;