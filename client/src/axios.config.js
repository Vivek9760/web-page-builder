import axios from 'axios';

axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(async (request) => {
    return request;
})

axios.interceptors.response.use(async (response) => {
    return response
}, (error) => {
    if (error.response.status == 401 && error.response.data.status == 'TERMINATE') {
        window.location.href = '/';
    }
    return Promise.reject(error);
})