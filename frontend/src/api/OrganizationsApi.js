import axios from 'axios';
import config from '../config';

export default class OrganizationsApi {

    static findAll = () => {
        return axios.get(`${config.url.api}/organizations`);
    }
}