import { error, validation } from '../constants.js';
import {Srt} from '../util.js'

class SubtitleService {

    constructor(vupDao, liveDao, subtitleDao, qiniuClient) {
        this.vupDao = vupDao;
        this.liveDao = liveDao;
        this.subtitleDao = subtitleDao;
        this.qiniuClient = qiniuClient;
        this.srt = new Srt();
    }

    insertByLiveId = (req, rsp) => {
        try {
            // 检查参数合法性
            const liveId = req.params.liveId;
            const live = this.liveDao.findById(liveId);
            if (!live) {
                rsp.status(400);
                return error.liveNotFound;
            }

            // TODO 去掉符号
            const content = (req.body || '').replace(/<[^><]*>/g, '');
            if (content.length < validation.subtitle.content.lowerLimit) {
                rsp.status(400);
                return error.subtitleContentLengthTooShort;
            }

            const vup = this.vupDao.findById(live.vupId);
            if (!vup) {
                rsp.status(400);
                return error.vupNotFound;
            }

            const qiniuKey = `srt/${vup.organizationId}/${vup.uid}/${live.bv}.srt`;
            const r0 = this.qiniuClient.forceUpload(qiniuKey, content) || {};
            console.log(r0);
            if (r0.error) {
                rsp.status(500);
                return {
                    error: error.QiniuError.error,
                    message: r0.toString()
                }
            }
            
            const items = this.srt.parse(content) || [];
            if (items.length > 0) {
                this.subtitleDao.deleteByLiveId(liveId); // 首先删除历史字幕
                this.subtitleDao.insertByLiveId(liveId, items);
                return this.subtitleDao.findByLiveId(liveId);
            } else {
                rsp.status(400);
                return error.subtitleContentParseError;
            }
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    update = (req, rsp) => {
        try {
            // 检查参数合法性
            const liveId = req.params.liveId;
            const lineId = req.params.lineId;

            let subtitle = this.subtitleDao.findByLiveIdAndLineId(liveId, lineId);
            if (!subtitle) {
                rsp.status(400);
                return error.subtitleNotFound;
            }
            
            if (req.body.hasOwnProperty('start')) {
                subtitle.start = req.body.start;
            }
            if (req.body.hasOwnProperty('end')) {
                subtitle.end = req.body.end;
            }
            if (req.body.hasOwnProperty('content')) {
                const content = req.body.content || '';
                if (content.length < validation.subtitle.content.lowerLimit) {
                    rsp.status(400);
                    return error.subtitleContentLengthTooShort;
                }
                subtitle.content = content;
            }
            this.subtitleDao.update(subtitle);
            return this.subtitleDao.findByLiveIdAndLineId(liveId, lineId);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    deleteByLiveId = (req, rsp) => {
        try {
            const liveId = req.params.liveId;
            this.subtitleDao.deleteByLiveId(liveId);
            rsp.status(204);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    findByLiveId = (req, rsp) => {
        try {
            const liveId = req.params.liveId;
            return this.subtitleDao.findByLiveId(liveId);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }
}

export default SubtitleService;