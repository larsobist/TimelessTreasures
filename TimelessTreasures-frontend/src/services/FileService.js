import http from "../http-common";
import authHeader from "./AuthHeader";

// post img
const uploadImg = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
    onUploadProgress,
  });
};

// get img
const getFiles = () => {
  return http.get("/files", { headers: authHeader() });
};

// delete img
const removeImg = (name) => {
  return http.delete(`/files/${name}`, { headers: authHeader() });
};

const FileService = {
  uploadImg,
  getFiles,
  removeImg
};

export default FileService;
