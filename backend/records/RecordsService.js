import moment from "moment";
import error from "../error.js";
import validation from "../validation.js";

export default class RecordsService {

    insert = (ctx) => {
        const req = ctx.request;
        let record = {};
        record.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        // 检查参数合法性
        const target = req.body.target || '';
        console.log(target);
        if (!validation.records.target.range.includes(target)) {
            throw error.records.target.Illegal;
        }
        record.target = target;

        const type = req.body.type || '';
        if (!validation.records.type.range.includes(type)) {
            throw error.records.type.Illegal;
        }
        record.type = type;

        const entity = req.body.entity || {};
        record.entity = JSON.stringify(entity);

        const remark = req.body.remark || '';
        if (remark.length > validation.records.remark.upperLimit) {
            throw error.records.remark.LengthTooLong;
        }
        record.remark = remark;

        ctx.recordsDao.insert(record);
        return {};
    }

    close = async (ctx) => {
        const req = ctx.request;
        const id = parseInt(req.params.id);
        const record = ctx.recordsDao.findById(id);
        if (!record) {
            throw error.records.NotFound;
        }
        if (record.verified === 1) {
            throw error.records.verified.Verified;
        }
        if (record.verified === 2) {
            throw error.records.verified.Closed;
        }

        const comment = req.body.comment || '';
        if (comment.length > validation.records.comment.upperLimit) {
            throw error.records.comment.upperLimit;
        }

        record.verified = 2;
        record.comment = comment;
        ctx.recordsDao.update(record);
        ctx.status = 204;
    }

    verify = async (ctx) => {
        const req = ctx.request;
        const id = parseInt(req.params.id);
        const record = ctx.recordsDao.findById(id);
        if (!record) {
            throw error.records.NotFound;
        }

        if (record.verified === 1) {
            throw error.records.verified.Verified;
        }
        if (record.verified === 2) {
            throw error.records.verified.Closed;
        }

        const comment = req.body.comment || '';
        if (comment.length > validation.records.comment.upperLimit) {
            throw error.records.comment.upperLimit;
        }

        ctx.state.entity = JSON.parse(record.entity);
        if (record.target === 'organizations') {
            if (record.type === 'insert') {
                await ctx.organizationsService.insert(ctx);
            } else if (record.type === 'update') {
                await ctx.organizationsService.update(ctx);
            } else if (record.type === 'delete') {
                await ctx.organizationsService.deleteById(ctx);
            }
        } else if (record.target === 'authors') {
            if (record.type === 'insert') {
                await ctx.authorsService.insert(ctx);
            } else if (record.type === 'update') {
                await ctx.authorsService.update(ctx);
            } else if (record.type === 'delete') {
                await ctx.authorsService.deleteById(ctx);
            }
        } else if (record.target === 'clips') {
            if (record.type === 'insert') {
                await ctx.clipsService.insert(ctx);
            } else if (record.type === 'update') {
                await ctx.clipsService.update(ctx);
            } else if (record.type === 'delete') {
                await ctx.clipsService.deleteById(ctx);
            }
        } else if (record.target === 'subtitles') {
            if (record.type === 'insert') {
                await ctx.subtitlesService.insert(ctx);
            } else if (record.type === 'delete') {
                await ctx.subtitlesService.deleteByClipId(ctx);
            }
        }

        record.verified = 1;
        record.comment = comment;
        ctx.recordsDao.update(record);
        ctx.status = 204;
    };

    deleteById = (ctx) => {
        const req = ctx.request;
        const id = parseInt(req.params.id);
        ctx.recordsDao.deleteById(id);
    }

    findByTarget = (ctx) => {
        const req = ctx.request;
        const target = req.params.target;
        return ctx.recordsDao.findByTarget(target);
    }
}