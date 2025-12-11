import axios from 'axios';
import Cookies from 'universal-cookie';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend adresin
});

// Her istekten (request) önce çalışır
api.interceptors.request.use((config) => {
  const cookies = new Cookies();
  // Login olurken cookie'ye 'loggedInUser' adıyla kaydetmiştik
  const user = cookies.get('loggedInUser'); 

  // Eğer kullanıcı giriş yapmışsa ve token varsa
  if (user && user.access_token) {
    // Header'a Token'ı ekle: "Bearer eyJhbGci..."
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});