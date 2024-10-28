import axios from 'axios';
import { useHistory } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    if (userInfo && userInfo.access) {
      const currentDate = new Date();
      const decodedToken = parseJwt(userInfo.access);

      if (decodedToken && decodedToken.exp * 1000 < currentDate.getTime()) {
        try {
          const response = await axios.post('/api/token/refresh/', {
            refresh: userInfo.refresh,
          });

          const newAccessToken = response.data.access;

          userInfo.access = newAccessToken;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error('Error refreshing token', error);

          localStorage.removeItem('userInfo');
          window.location.href = '/login'; 
        }
      } else {
        config.headers.Authorization = `Bearer ${userInfo.access}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing token', e);
    return null;
  }
};

export default axiosInstance;
