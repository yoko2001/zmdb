import error from "../error.js";
import validation from "../validation.js";
import config from "../config.js";

export default class AuthorsService {

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let author = {};
        // 检查参数合法性
        const organizationId = entity.organizationId;
        if (!ctx.organizationsDao.findById(organizationId)) {
            throw error.organizations.NotFound;
        }
        author.organizationId = organizationId;

        const name = entity.name || '';
        if (name.length < validation.authors.name.lowerLimit) {
            throw error.authors.name.LengthTooShort;
        }
        if (name.length > validation.authors.name.upperLimit) {
            throw error.authors.name.LengthTooLong;
        }
        author.name = name;
        author.uid = entity.uid || '';

        ctx.authorsDao.insert(author);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = filename.substring(filename.lastIndexOf('.'));
        const dst = `authors/${organizationId}/${r.lastInsertRowid}${extension}`;
        const src = entity.filename;
        await ctx.filesClient.move(src, dst);
    }

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     */
    update = async (ctx) => {
        const entity = ctx.state.entity;
        // 检查参数合法性
        const id = entity.id;
        let author = ctx.authorsDao.findById(id);
        if (!author) {
            throw error.authors.NotFound;
        }
        if (entity.hasOwnProperty('organizationId')) {
            const organizationId = entity.organizationId;
            if (!ctx.organizationsDao.findById(organizationId)) {
                throw error.organizations.NotFound;
            }
            author.organizationId = organizationId;
        }
        if (entity.hasOwnProperty('uid')) {
            author.uid = entity.uid;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name || '';
            if (name.length < validation.authors.name.lowerLimit) {
                throw error.authors.name.LengthTooShort;
            }
            if (name.length > validation.authors.name.upperLimit) {
                throw error.authors.name.LengthTooLong;
            }
            author.name = name;
        }

        ctx.authorsDao.update(author);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const extension = filename.substring(filename.lastIndexOf('.'));
            const dst = `authors/${organizationId}/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        const author = ctx.authorsDao.findById(id);
        ctx.authorsDao.deleteById(id);
        const file = `authors/${author.organizationId}/${id}.webp`;
        await ctx.filesClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const req = ctx.request;
        const organizationId = parseInt(req.params.organizationId);
        return ctx.authorsDao.findByOrganizationId(organizationId);
    }

    findAll = (ctx) => {
        return ctx.authorsDao.findAll();
    }
}