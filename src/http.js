import axios from 'axios';

const baseURL = 'https://api.unsplash.com';

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//   baseURL = 'http://127.0.0.1/'
// } else {
//   baseURL = 'http://api.example.com'
// }

export const HTTP = axios.create(
  {
    'baseURL': baseURL,
    headers: {
      'accept-version': 'v1',
      'authorization': 'Client-ID 21db1657cd9858c335fc901b2e261311a2d13cc36da9e418dab45e5d333260da'
    }
  }
)