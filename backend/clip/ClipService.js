import error from "../error.js";
import validation from "../validation.js";
import { toExtension } from '../utils.js';

export default class ClipService {

    /**
     * @param {authorId} 作者id 
     * @param {title} 作品标题
     * @param {bv} B站视频号，长度为12字符
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @param {filename} 视频缩略图
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let clip = {};
        // 检查参数合法性
        const authorId = entity.authorId;
        const author = ctx.authorDao.findById(authorId);
        if (!author) {
            throw error.author.NotFound;
        }
        clip.authorId = authorId;

        const title = entity.title || '';
        if (title.length < validation.clip.title.lowerLimit) {
            throw error.clip.title.LengthTooShort;
        }
        if (title.length > validation.clip.title.upperLimit) {
            throw error.clip.title.LengthTooLong;
        }
        clip.title = title;

        // TODO 增加bv合法性校验
        const bv = entity.bv || '';
        if (bv.length !== validation.clip.bv.limit) {
            throw error.clip.bv.IllegalFormat;
        }
        clip.bv = bv;

        // TODO 增加datetime格式校验
        const datetime = entity.datetime || '';
        if (datetime.length !== validation.clip.datetime.limit) {
            return error.clip.datetime.IllegalFormat;
        }
        clip.datetime = datetime;

        ctx.clipDao.insert(clip);

        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = filename.substring(filename.lastIndexOf('.'));
        const dst = `clips/${author.organizationId}/${authorId}/${r.lastInsertRowid}${extension}`;
        const src = entity.filename;
        await ctx.filesClient.move(src, dst);
    }

    /**
     * @param {id} 作品id
     * @param {authorId} 作者id 
     * @param {title} 作品标题
     * @param {bv} B站视频号，长度为12字符
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     * @param {filename} 头像缩略图
     */
    update = async (ctx) => {
        const entity = ctx.state.entity;
        // 检查参数合法性
        const id = entity.id;
        let clip = ctx.clipDao.findById(id);
        if (!clip) {
            throw error.clip.NotFound;
        }

        if (entity.hasOwnProperty('authorId')) {
            const authorId = entity.authorId || 0;
            if (!ctx.authorDao.findById(authorId)) {
                throw error.author.NotFound;
            }
            clip.authorId = authorId;
        }

        if (entity.hasOwnProperty('title')) {
            const title = req.body.title || '';
            if (title.length < validation.clip.title.lowerLimit) {
                throw error.clip.title.LengthTooShort;
            }
            if (title.length > validation.clip.title.upperLimit) {
                throw error.clip.title.LengthTooLong;
            }
            clip.title = title;
        }
        if (entity.hasOwnProperty('bv')) {
            // TODO 增加bv合法性校验
            const bv = entity.bv || '';
            if (bv.length !== validation.clip.bv.limit) {
                throw error.clip.bv.IllegalFormat;
            }
            clip.bv = bv;
        }
        if (entity.hasOwnProperty('datetime')) {
            // TODO 增加datetime格式校验
            const datetime = entity.datetime || '';
            if (datetime.length !== validation.clip.datetime.limit) {
                throw error.clip.datetime.IllegalFormat;
            }
            clip.datetime = datetime;
        }

        ctx.clipDao.update(clip);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const author = ctx.authorDao.findById(clip.authorId);
            const extension = toExtension(filename);
            const dst = `clips/${author.organizationId}/${author.id}/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        const clip = ctx.clipDao.findById(id);
        const author = ctx.authorDao.findById(id);
        ctx.clipDao.deleteById(id);
        
        const file = `clips/${author.organizationId}/${clip.authorId}/${id}.webp`;
        await ctx.filesClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const req = ctx.request;
        const organizationId = parseInt(req.params.organizationId);
        return ctx.clipDao.findByOrganizationId(organizationId);
    }

    find = (ctx) => {
        const req = ctx.request;
        if (req.query.authorIds && req.query.content) {
            const authorIds = req.query.authorIds.split(",") || [];
            if (authorIds.length < validation.clip.author.lowerLimit) {
                throw error.clip.author.TooLittle;
            }
            if (authorIds.length > validation.clip.author.upperLimit) {
                throw error.clip.author.TooMuch;
            }

            // TODO 删除content中的符号字符
            const content = req.query.content || '';
            if (content.length < validation.clip.content.lowerLimit) {
                throw error.clip.content.LengthTooShort;
            }
            if (content.length > validation.clip.content.upperLimit) {
                throw error.clip.content.LengthTooLong;
            }
            return ctx.clipDao.findByAuthorIdsAndContent(authorIds, content);
        } else {
            return ctx.clipDao.findAll();
        }
    }
}