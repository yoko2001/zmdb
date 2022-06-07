import validation from "../validation.js";
import error from '../error.js';
import { toExtension } from "../utils.js";

export default class OrganzationService {
    /**
     * 
     * @param {name} 社团名称，长度不能低于1字符，不能超过20字符 
     * @param {filename} 头像文件名
     * @returns 
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let organization = {};
        // 检查参数合法性
        const name = entity.name || '';
        if (name.length < validation.organization.name.lowerLimit) {
            throw error.organization.name.LengthTooShort;
        }
        if (name.length > validation.organization.name.upperLimit) {
            throw error.organization.name.LengthTooLong;
        }
        organization.name = name;

        const r = ctx.organizationDao.insert(organization);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
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
        let organization = ctx.organizationDao.findById(id);
        if (!organization) {
            throw error.organization.NotFound;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name;
            if (name.length < validation.organization.name.lowerLimit) {
                throw error.organization.name.LengthTooShort;
            }
            if (name.length > validation.organization.name.upperLimit) {
                throw error.organization.name.LengthTooLong;
            }
            organization.name = name;
        }

        ctx.organizationDao.update(organization);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = toExtension(filename);
            const dst = `organizations/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        ctx.organizationDao.deleteById(id);
        
        const file = `organizations/${id}.webp`;
        await ctx.filesClient.delete(file);
    }
    
    findAll = (ctx) => {
        return ctx.organizationDao.findAll();
    }
}