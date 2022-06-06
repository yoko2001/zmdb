import config from "../config.js";
import validation from "../validation.js";
import error from '../error.js';

export default class OrganzationsService {
    /**
     * 
     * @param {name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @returns 
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let organization = {};
        // 检查参数合法性
        const name = entity.name || '';
        if (name.length < validation.organizations.name.lowerLimit) {
            throw error.organizations.name.LengthTooShort;
        }
        if (name.length > validation.organizations.name.upperLimit) {
            throw error.organizations.name.LengthTooLong;
        }
        organization.name = name;

        const r = ctx.organizationsDao.insert(organization);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = filename.substring(filename.lastIndexOf('.'));
        const dst = `organizations/${r.lastInsertRowid}${extension}`;
        const src = entity.filename;
        await ctx.filesClient.move(src, dst);
    }

    /**
     * 
     * @param {name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @returns 
     */
    update = async (ctx) => {
        const entity = ctx.state.entity;
        const id = parseInt(entity.id);
        // 检查参数合法性
        let organization = ctx.organizationsDao.findById(id);
        if (!organization) {
            throw error.organizations.NotFound;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name;
            if (name.length < validation.organizations.name.lowerLimit) {
                throw error.organizations.name.LengthTooShort;
            }
            if (name.length > validation.organizations.name.upperLimit) {
                throw error.organizations.name.LengthTooLong;
            }
            organization.name = name;
        }

        ctx.organizationsDao.update(organization);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = filename.substring(filename.lastIndexOf('.'));
            const dst = `organizations/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        ctx.organizationsDao.deleteById(id);
        const file = `organizations/${id}.webp`;
        await ctx.filesClient.delete(file);
    }
    
    findAll = (ctx) => {
        return ctx.organizationsDao.findAll();
    }
}