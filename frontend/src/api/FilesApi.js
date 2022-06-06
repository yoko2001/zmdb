import axios from 'axios';
import config from '../config';

export default class FilesApi {

    static uploadImage = (file) => {
        return axios.postForm(`${config.url.api}/files/image`, {
            'file': file
        });
    }
}