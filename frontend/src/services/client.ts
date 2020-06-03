// client.js
const axios = require('axios');
var baseUrl = 'http://localhost:80';

class Client{

    all(endpoint) {
        var url = `${baseUrl}/${endpoint}`;
        let res = axios.get(url);
        return res;
    }

    get(endpoint, id) {
        var url = `${baseUrl}/${endpoint}/${id}`;
        let res = axios.get(url);
        return res;
    }


    delete(endpoint, id) {
        var url = `${baseUrl}/${endpoint}/${id}`;
        let res = axios.delete(url);
        return res;
    }
     

    post(endpoint, data) {
        var url = `${baseUrl}/${endpoint}`;
        let res = axios.post(url, data);
        return res;
    }

}

const client = new Client();

export default client;
