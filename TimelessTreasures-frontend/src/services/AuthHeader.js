// Bearer Token from Storage
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token }; // for Spring Boot back-end
  } else {
    return {};
  }
}