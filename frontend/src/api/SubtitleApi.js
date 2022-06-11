import axios from 'axios';
import config from '../config';

export default class SubtitlesApi {

    static findByClipId = (clipId) => {
        return axios.get(`${config.url.api}/clips/${clipId}/subtitles`);
    }
}