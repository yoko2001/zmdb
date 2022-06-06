import axios from 'axios';
import config from '../config';

export default class AuthorsApi {

    static findByOrganizationId = (organizationId) => {
        return axios.get(`${config.url.api}/organizations/${organizationId}/authors`);
    }

    static findAll = () => {
        return axios.get(`${config.url.api}/authors`);
    }
}