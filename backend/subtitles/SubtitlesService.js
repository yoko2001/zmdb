import error from '../error.js'
import validation from '../validation.js';

export default class SubtitlesService {

    /**
     * @param {clipId} 作品id
     * @param {content} 字幕srt内容 
     * @returns 
     */
    insert = async (ctx) => {
        const entity = ctx.state.entity;
        // 检查参数合法性
        const clipId = entity.clipId;
        const clip = ctx.clipsDao.findById(clipId);
        if (!clip) {
            throw error.clips.NotFound;
        }

        const author = ctx.authorsDao.findById(clip.authorId);
        if (!author) {
            throw error.authors.NotFound;
        }

        // TODO 去掉符号
        const content = (entity.content || '').replace(/<[^><]*>/g, '');
        if (content.length < validation.subtitles.content.lowerLimit) {
            throw error.subtitles.content.LengthTooShort;
        }

        const subtitles = ctx.srt.parse(content) || [];
        if (subtitles.length === 0) {
            return error.subtitles.content.ParseError;
        }

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.filesClient.save(path, content);        
        
        ctx.subtitlesDao.deleteByClipId(clipId); // 首先删除历史字幕
        ctx.subtitlesDao.insertByClipId(clipId, subtitles);
    }

    deleteByClipId = async (ctx) => {
        const entity = ctx.state.entity;
        const clipId = entity.clipId;

        const author = ctx.authorsDao.findById(clip.authorId);
        if (!author) {
            throw error.authors.NotFound;
        }

        ctx.subtitlesDao.deleteByClipId(clipId); // 删除历史字幕

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.filesClient.delete(path);
    }

    findByClipId = async (ctx) => {
        const req = ctx.request;
        const clipId = parseInt(req.params.clipId);
        return ctx.subtitlesDao.findByClipId(clipId);
    }
}