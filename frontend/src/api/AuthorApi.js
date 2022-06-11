import axios from 'axios';
import config from '../config';

export default class AuthorApi {

    static findByOrganizationId = (organizationId) => {
        return axios.get(`${config.url.api}/organizations/${organizationId}/authors`);
    }
}