export const isAuth = () => {
  return localStorage.getItem('token') !== null;
}

export const getToken = () => {
  return localStorage.getItem('token');
}

export const login = (token) => {
  localStorage.setItem('token', token);
}

export const logout = () => {
  localStorage.removeItem('token');
}