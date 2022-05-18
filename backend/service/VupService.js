import { error, validation } from '../constants.js';

class VupService {

    constructor(vupDao, organizationDao) {
        this.vupDao = vupDao;
        this.organizationDao = organizationDao;
    }

    /**
     * 
     * @param {organizationId} 社团id 
     * @param {uid} 主播的B站账号
     * @param {name} 主播的B站昵称，长度不能低于1字符，不能超过20字符
     * @returns 
     */
    insert = (req, rsp) => {
        // 检查参数合法性
        try {
            const organizationId = req.params.organizationId || 0;
            if (!this.organizationDao.findById(organizationId)) {
                rsp.status(400);
                return error.organizationNotFound;
            }

            const name = req.body.name || '';
            if (name.length < validation.vup.name.lowerLimit) {
                rsp.status(400);
                return error.vupNameLengthTooShort;
            }
            if (name.length > validation.vup.name.upperLimit) {
                rsp.status(400);
                return error.vupNameLengthTooLong;
            }

            const vup = {
                organizationId: organizationId,
                uid: req.body.uid,
                name: req.body.name
            };
            const r = this.vupDao.insert(vup);
            return this.vupDao.findById(r.lastInsertRowid);
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
     * @param {organizationId} 社团id 
     * @param {uid} 主播的B站账号
     * @param {name} 主播的B站昵称，长度不能低于1字符，不能超过20字符
     * @returns 
     */
    update = (req, rsp) => {
        try {
            // 检查参数合法性
            let po = this.vupDao.findById(req.params.id);
            if (!po) {
                rsp.status(400);
                return error.vupNotFound;
            }
            if (req.body.hasOwnProperty('organizationId')) {
                const organizationId = req.body.organizationId;
                if (!this.organizationDao.findById(organizationId)) {
                    rsp.status(400);
                    return error.organizationNotFound;
                }
                po.organizationId = organizationId;
            }
            if (req.body.hasOwnProperty('uid')) {
                po.uid = req.body.uid;
            }
            if (req.body.hasOwnProperty('name')) {
                const name = req.body.name || '';
                if (name.length < validation.vup.name.lowerLimit) {
                    rsp.status(400);
                    return error.vupNameLengthTooShort;
                }
                if (name.length > validation.vup.name.upperLimit) {
                    rsp.status(400);
                    return error.vupNameLengthTooLong;
                }
                po.name = name;
            }

            this.vupDao.update(po);
            return this.vupDao.findById(req.params.id);
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
            this.vupDao.deleteById(req.params.id);
            rsp.status(204);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }

    findByOrganizationId= (req, rsp) => {
        try {
            const organizationId = req.params.organizationId;
            return this.vupDao.findByOrganizationId(organizationId);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }
}

export default VupService;