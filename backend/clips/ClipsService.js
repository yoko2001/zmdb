import error from "../error.js";
import validation from "../validation.js";
import config from "../config.js";

export default class ClipsService {

    /**
     * @param {authorId} 作者id 
     * @param {title} 作品标题
     * @param {bv} B站视频号，长度为12字符
     * @param {datetime} 时间日期字符串，格式为YYYY-MM-DD HH:MM:SS
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        let clip = {};
        // 检查参数合法性
        const authorId = entity.authorId;
        const author = ctx.authorsDao.findById(authorId);
        if (!author) {
            throw error.authors.NotFound;
        }
        clip.authorId = authorId;

        const title = entity.title || '';
        if (title.length < validation.clips.title.lowerLimit) {
            throw error.clips.title.LengthTooShort;
        }
        if (title.length > validation.clips.title.upperLimit) {
            throw error.clips.title.LengthTooLong;
        }
        clip.title = title;

        // TODO 增加bv合法性校验
        const bv = entity.bv || '';
        if (bv.length !== validation.clips.bv.limit) {
            throw error.clips.bv.IllegalFormat;
        }
        clip.bv = bv;

        // TODO 增加datetime格式校验
        const datetime = entity.datetime || '';
        if (datetime.length !== validation.clips.datetime.limit) {
            return error.clips.datetime.IllegalFormat;
        }
        clip.datetime = datetime;

        ctx.clipsDao.insert(clip);

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
     */
    update = async (ctx) => {
        const entity = ctx.state.entity;
        // 检查参数合法性
        const id = entity.id;
        let clip = ctx.clipsDao.findById(id);
        if (!clip) {
            throw error.clips.NotFound;
        }

        if (entity.hasOwnProperty('authorId')) {
            const authorId = entity.authorId || 0;
            if (!ctx.authorsDao.findById(authorId)) {
                throw error.authors.NotFound;
            }
            clip.authorId = authorId;
        }

        if (entity.hasOwnProperty('title')) {
            const title = req.body.title || '';
            if (title.length < validation.clips.title.lowerLimit) {
                throw error.clips.title.LengthTooShort;
            }
            if (title.length > validation.clips.title.upperLimit) {
                throw error.clips.title.LengthTooLong;
            }
            clip.title = title;
        }
        if (entity.hasOwnProperty('bv')) {
            // TODO 增加bv合法性校验
            const bv = entity.bv || '';
            if (bv.length !== validation.clips.bv.limit) {
                throw error.clips.bv.IllegalFormat;
            }
            clip.bv = bv;
        }
        if (entity.hasOwnProperty('datetime')) {
            // TODO 增加datetime格式校验
            const datetime = entity.datetime || '';
            if (datetime.length !== validation.clips.datetime.limit) {
                throw error.clips.datetime.IllegalFormat;
            }
            clip.datetime = datetime;
        }

        ctx.clipsDao.update(clip);

        if (entity.hasOwnProperty('filename')) {
            const filename = entity.filename || '';
            if (filename.length === 0) {
                throw error.files.NotFound;
            }
            const author = ctx.authorsDao.findById(clip.authorId);
            const extension = filename.substring(filename.lastIndexOf('.'));
            const dst = `clips/${author.organizationId}/${author.id}/${r.lastInsertRowid}${extension}`;
            const src = entity.filename;
            await ctx.filesClient.move(src, dst);
        }
    }

    deleteById = async (ctx) => {
        const entity = ctx.state.entity;
        const id = entity.id;
        const clip = ctx.clipsDao.findById(id);
        const author = ctx.authorsDao.findById(id);
        ctx.clipsDao.deleteById(id);
        const file = `clips/${author.organizationId}/${clip.authorId}/${id}.webp`;
        await ctx.filesClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const req = ctx.request;
        const organizationId = parseInt(req.params.organizationId);
        return ctx.clipsDao.findByOrganizationId(organizationId);
    }

    find = (ctx) => {
        const req = ctx.request;
        if (req.query.authorIds && req.query.content) {
            const authorIds = req.query.authorIds.split(",") || [];
            if (authorIds.length < validation.clips.authors.lowerLimit) {
                throw error.clips.authors.TooLittle;
            }
            if (authorIds.length > validation.clips.authors.upperLimit) {
                throw error.clips.authors.TooMuch;
            }

            // TODO 删除content中的符号字符
            const content = req.query.content || '';
            if (content.length < validation.clips.content.lowerLimit) {
                throw error.clips.content.LengthTooShort;
            }
            if (content.length > validation.clips.content.upperLimit) {
                throw error.clips.content.LengthTooLong;
            }
            return ctx.clipsDao.findByAuthorIdsAndContent(authorIds, content);
        } else {
            return ctx.clipsDao.findAll();
        }
    }
}