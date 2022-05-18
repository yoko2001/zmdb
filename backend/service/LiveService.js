import { error, validation } from '../constants.js';

class LiveService {

    constructor(organizationDao, vupDao, liveDao) {
        this.organizationDao = organizationDao;
        this.vupDao = vupDao;
        this.liveDao = liveDao;
    }

    /**
     * 
     * @param {vupId} 主播id 
     * @param {title} 直播标题
     * @param {bv} B站录播视频号，长度为12字符
     * @param {verified} 字幕是否已人工校验
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @returns 
     */
    insert = (req, rsp) => {
        try {
            // 检查参数合法性
            const vupId = req.params.vupId || 0;
            if (!this.vupDao.findById(vupId)) {
                rsp.status(400);
                return error.vupNotFound;
            }

            const title = req.body.title || '';
            if (title.length < validation.live.title.lowerLimit) {
                rsp.status(400);
                return error.liveTitleLengthTooShort;
            }
            if (title.length > validation.live.title.upperLimit) {
                rsp.status(400);
                return error.liveTitleLengthTooLong;
            }

            // TODO 增加bv合法性校验
            const bv = req.body.bv || '';
            if (bv.length !== validation.live.bv.limit) {
                rsp.status(400);
                return error.liveBvFormatIllegal;
            }

            const verified = parseInt(req.body.verified);
            if (verified !== 0 && verified !== 1) {
                rsp.status(400);
                return error.liveVerifiedIllegal;
            }

            // TODO 增加datetime格式校验
            const datetime = req.body.datetime || '';
            if (datetime.length !== validation.live.datetime.limit) {
                rsp.status(400);
                return error.liveDatetimeFormatIllegal;
            }

            const live = {
                vupId: vupId,
                title: title,
                bv: bv,
                verified: verified,
                datetime: datetime
            }
            const r = this.liveDao.insert(live);
            return this.liveDao.findById(r.lastInsertRowid);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    /**
     * 
     * @param {vupId} 主播id 
     * @param {title} 直播标题
     * @param {bv} B站录播视频号，长度为12字符
     * @param {verified} 字幕是否已人工校验
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @returns 
     */
    update = (req, rsp) => {
        try {
            // 检查参数合法性
            let po = this.liveDao.findById(req.params.id);
            if (!po) {
                rsp.status(400);
                return error.liveNotFound;
            }

            if (req.body.hasOwnProperty('vupId')) {
                const vupId = req.body.vupId || 0;
                if (!this.vupDao.findById(vupId)) {
                    rsp.status(400);
                    return error.vupNotFound;
                }
                po.vupId = vupId;
            }
            if (req.body.hasOwnProperty('title')) {
                const title = req.body.title || '';
                if (title.length < validation.live.title.lowerLimit) {
                    rsp.status(400);
                    return error.liveTitleLengthTooShort;
                }
                if (title.length > validation.live.title.upperLimit) {
                    rsp.status(400);
                    return error.liveTitleLengthTooLong;
                }
                po.title = title;
            }
            if (req.body.hasOwnProperty('bv')) {
                // TODO 增加bv合法性校验
                const bv = req.body.bv || '';
                if (bv.length !== validation.live.bv.limit) {
                    rsp.status(400);
                    return error.liveBvFormatIllegal;
                }
                po.bv = bv;
            }
            if (req.body.hasOwnProperty('verified')) {
                const verified = req.body.verified;
                if (verified !== '0' && verified !== '1') {
                    rsp.status(400);
                    return error.liveVerifiedIllegal;
                }
                po.verified = verified;
            }
            if (req.body.hasOwnProperty('datetime')) {
                // TODO 增加datetime格式校验
                const datetime = req.body.datetime || '';
                if (datetime.length !== validation.live.datetime.limit) {
                    rsp.status(400);
                    return error.liveDatetimeFormatIllegal;
                }
                po.datetime = datetime;
            }

            this.liveDao.update(po);
            return this.liveDao.findById(req.params.id);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    deleteById = (req, rsp) => {
        try {
            this.liveDao.deleteById(req.params.id);
            rsp.status(204);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    findByVupId = (req, rsp) => {
        try {
            const vupId = req.params.vupId;
            return this.liveDao.findByVupId(vupId);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    findByOrganizationId = (req, rsp) => {
        try {
            const organizationId = req.params.organizationId;
            return this.liveDao.findByOrganizationId(organizationId);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    findByVupIdsAndContent = (req, rsp) => {
        try {
            const vupIds = req.query.vupIds.split(",") || [];
            if (vupIds.length < validation.live.vupIds.lowerLimit) {
                rsp.status(400);
                return error.liveVupIdsTooLittle;
            }
            if (vupIds.length > validation.live.vupIds.upperLimit) {
                rsp.status(400);
                return error.liveVupIdsTooMuch;
            }

            // TODO 删除content中的符号字符
            const content = req.query.content || '';
            if (content.length < validation.live.content.lowerLimit) {
                rsp.status(400);
                return error.liveContentLengthTooShort;
            }
            if (content.length > validation.live.content.upperLimit) {
                rsp.status(400);
                return error.liveContentLengthTooLong;
            }
            return this.liveDao.findByVupIdsAndContent(vupIds, content);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }
}

export default LiveService;