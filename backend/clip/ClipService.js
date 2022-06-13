import { pinyin } from 'pinyin-pro';
import error from "../error.js";
import validation from "../validation.js";
import config from "../config.js";
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
        const entity = ctx.request.body;
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

        const r = ctx.clipDao.insert(clip);
        const id = r.lastInsertRowid;

        await ctx.fileClient.mkdir(`${config.web.staticDir}/clips/${author.organizationId}/${authorId}`);
        
        const filename = entity.filename || '';
        if (filename.length === 0) {
            throw error.files.NotFound;
        }
        const extension = toExtension(filename);
        const dst = `clips/${author.organizationId}/${authorId}/${id}${extension}`;
        const src = filename;
        await ctx.fileClient.move(src, dst);

        return ctx.clipDao.findById(id);
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
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        console.log(entity);
        // 检查参数合法性
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
            const title = entity.title || '';
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
            const dst = `clips/${author.organizationId}/${author.id}/${id}${extension}`;
            const src = filename;
            await ctx.fileClient.move(src, dst);
        }

        return ctx.clipDao.findById(id);
    }

    deleteById = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const clip = ctx.clipDao.findById(id);
        const author = ctx.authorDao.findById(id);
        ctx.clipDao.deleteById(id);
        
        const file = `clips/${author.organizationId}/${clip.authorId}/${id}.webp`;
        await ctx.fileClient.delete(file);
    }

    findByOrganizationId = (ctx) => {
        const organizationId = parseInt(ctx.params.organizationId);
        return ctx.clipDao.findByOrganizationId(organizationId);
    }

    find = (ctx) => {
        const req = ctx.request;
        const authorIds = req.query.authorIds.split(",") || [];
        if (authorIds.length < validation.clip.authors.lowerLimit) {
            throw error.clip.authors.TooLittle;
        }
        if (authorIds.length > validation.clip.authors.upperLimit) {
            throw error.clip.authors.TooMuch;
        }

        // TODO 删除content中的符号字符
        const keyword = req.query.keyword || '';
        if (keyword.length < validation.clip.content.lowerLimit) {
            throw error.clip.content.LengthTooShort;
        }
        if (keyword.length > validation.clip.content.upperLimit) {
            throw error.clip.content.LengthTooLong;
        }

        const pinyinKeyword = pinyin(keyword, {toneType:'num'});
        const r1 = ctx.clipDao.findByAuthorIdsAndKeyword(authorIds, keyword);
        const r2 = ctx.clipDao.findByAuthorIdsAndPinyinKeyword(authorIds, pinyinKeyword);
        r1.forEach(item => {
            item.matchMode = 1;
        });
        r2.forEach(item => {
            item.matchMode = 2;
        });
        let r = r1;
        r2.forEach(clip2 => {
            for (let clip1 of r1) {
                if (clip2.id === clip1.id) {
                    return;
                }
            }
            r.push(clip2);
        });
        r.sort((a, b) => {
            a.datetime - b.datetime;
        });
        return r;
    }
}