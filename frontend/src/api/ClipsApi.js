import axios from 'axios';
import config from '../config';

export default class ClipsApi {

    static findByOrganizationId = (organizationId) => {
        return axios.get(`${config.url.api}/organizations/${organizationId}/clips`);
    }

    static findByAuthorIdsAndContent = (authorIds, content) => {
        return axios.get(`${config.url.api}/clips`, {
            params: { authorIds, content }
        });
    }

    static findAll = () => {
        return axios.get(`${config.url.api}/clips`);
    }
}