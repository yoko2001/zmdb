import error from "../error.js";
import validation from "../validation.js";
import {toExtension} from '../utils.js';

export default class AuthorService {

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {filename} 作者头像文件名
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let author = {};
        // 检查参数合法性
        const organizationId = entity.organizationId;
        if (!ctx.organizationDao.findById(organizationId)) {
            throw error.organization.NotFound;
        }
        author.organizationId = organizationId;

        const name = entity.name || '';
        if (name.length < validation.author.name.lowerLimit) {
            throw error.author.name.LengthTooShort;
        }
        if (name.length > validation.author.name.upperLimit) {
            throw error.author.name.LengthTooLong;
        }
        author.name = name;
        author.uid = entity.uid || '';

        ctx.authorDao.insert(author);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
        const dst = `authors/${organizationId}/${r.lastInsertRowid}${extension}`;
        const src = entity.filename;
        await ctx.filesClient.move(src, dst);
    }

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {filename} 作者的头像
     */
    update = async (ctx) => {
        const entity = ctx.state.entity;
        // 检查参数合法性
        const id = entity.id;
        let author = ctx.authorDao.findById(id);
        if (!author) {
            throw error.author.NotFound;
        }
        if (entity.hasOwnProperty('organizationId')) {
            const organizationId = entity.organizationId;
            if (!ctx.organizationDao.findById(organizationId)) {
                throw error.organization.NotFound;
            }
            author.organizationId = organizationId;
        }
        if (entity.hasOwnProperty('uid')) {
            author.uid = entity.uid;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name || '';
            if (name.length < validation.author.name.lowerLimit) {
                throw error.author.name.LengthTooShort;
            }
            if (name.length > validation.author.name.upperLimit) {
                throw error.author.name.LengthTooLong;
            }
            author.name = name;
        }

        ctx.authorDao.update(author);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = toExtension(filename);
            const dst = `authors/${organizationId}/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        const author = ctx.authorDao.findById(id);
        ctx.authorDao.deleteById(id);

        const file = `authors/${author.organizationId}/${id}.webp`;
        await ctx.filesClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const req = ctx.request;
        const organizationId = parseInt(req.params.organizationId);
        return ctx.authorDao.findByOrganizationId(organizationId);
    }

    findAll = (ctx) => {
        return ctx.authorDao.findAll();
    }
}