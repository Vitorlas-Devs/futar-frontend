import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://futar.cyclic.app/',
  withCredentials: true,
})

// const instance = axios.create({
//   baseURL: "http://localhost:5000/",
//   withCredentials: true,
// });

export default instance
