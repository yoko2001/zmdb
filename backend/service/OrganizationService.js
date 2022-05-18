import { error, validation } from '../constants.js';

class OrganizationService {

    constructor(organizationDao) {
        this.organizationDao = organizationDao;
    }

    /**
     * 
     * @param {req.body.name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @returns 
     */
    insert = (req, rsp) => {
        // 检查参数合法性
        const name = req.body.name || '';
        if (name.length < validation.organization.name.lowerLimit) {
            rsp.status(400);
            return error.organizationNameLengthTooShort;
        }
        if (name.length > validation.organization.name.upperLimit) {
            rsp.status(400);
            return error.organizationNameLengthTooLong;
        }

        try {
            const r = this.organizationDao.insert(req.body);
            return this.organizationDao.findById(r.lastInsertRowid);
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
     * @param {req.body.name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @returns 
     */
    update = (req, rsp) => {
        // 检查参数合法性
        let po = this.organizationDao.findById(req.params.id);
        if (!po) {
            rsp.status(400);
            return error.organizationNotFound;
        }

        if (req.body.hasOwnProperty('name')) {
            const name = req.body.name;
            if (name.length < validation.organization.name.lowerLimit) {
                rsp.status(400);
                return error.organizationNameLengthTooShort;
            }
            if (name.length > validation.organization.name.upperLimit) {
                rsp.status(400);
                return error.organizationNameLengthTooLong;
            }
            po.name = name;
        }

        try {
            this.organizationDao.update(po);
            return this.organizationDao.findById(req.params.id);
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
            this.organizationDao.deleteById(req.params.id);
            rsp.status(204);
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        } 
    }

    findAll = (req, rsp) => {
        try {
            return this.organizationDao.findAll();
        } catch (e) {
            rsp.status(500);
            return {
                error: error.sqliteError.error,
                message: e.message
            }
        }
    }
}

export default OrganizationService;