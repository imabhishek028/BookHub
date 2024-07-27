import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://192.168.243.221:8000',
    timeout: 10000,
    withCredentials:true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export default axiosInstance;