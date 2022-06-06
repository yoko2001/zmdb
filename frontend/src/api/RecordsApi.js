import axios from 'axios';
import config from '../config';

export default class RecordsApi {

    static findByTarget = (target) => {
        return axios.get(`${config.url.api}/records/${target}`);
    }

    static insert = (target, type, entity, remark) => {
        return axios.post(`${config.url.api}/records`, {
            target, type, entity, remark
        });
    }

    static deleteById = (id, token) => {
        return axios.delete(`${config.url.api}/records/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    static verify = (id, token) => {
        return axios.put(`${config.url.api}/records/${id}/verified/1`,{}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    static close = (id, comment, token) => {
        return axios.put(`${config.url.api}/records/${id}/verified/2`,
            {
                comment: comment
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    }
}