import { pinyin } from 'pinyin-pro';
import error from '../error.js'
import validation from '../validation.js';
import config from '../config.js';

export default class SubtitleService {

    /**
     * @param {clipId} 作品id
     * @param {content} 字幕srt内容 
     * @returns 
     */
    insert = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);
        let content = ctx.request.body || '';
        console.log(ctx.request.body);
        // 检查参数合法性
        const clip = ctx.clipDao.findById(clipId);
        if (!clip) {
            throw error.clip.NotFound;
        }

        const author = ctx.authorDao.findById(clip.authorId);
        if (!author) {
            throw error.author.NotFound;
        }

        // TODO 去掉符号
        content = content.replace(/<[^><]*>/g, '');
        if (content.length < validation.subtitle.content.lowerLimit) {
            throw error.subtitle.content.LengthTooShort;
        }

        const subtitles = ctx.srt.parse(content) || [];
        if (subtitles.length === 0) {
            return error.subtitle.content.ParseError;
        }

        await ctx.fileClient.mkdir(`${config.web.staticDir}/srt/${author.organizationId}/${author.id}`);

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.fileClient.save(path, content);        
        
        ctx.subtitleDao.deleteByClipId(clipId); // 首先删除历史字幕
        ctx.subtitleDao.insertByClipId(clipId, subtitles);
    }

    deleteByClipId = async (ctx) => {
        const clipId = parseInt(ctx.params.clipId);

        const author = ctx.authorDao.findById(clip.authorId);
        if (!author) {
            throw error.author.NotFound;
        }

        ctx.subtitleDao.deleteByClipId(clipId); // 删除历史字幕

        const path = `srt/${author.organizationId}/${author.id}/${clipId}.srt`;
        await ctx.fileClient.delete(path);
    }

    findByClipId = async (ctx) => {
        const req = ctx.request;
        const clipId = parseInt(req.params.clipId);
        let r = ctx.subtitleDao.findByClipId(clipId);
        r.forEach(item => {
            item.markedContent = item.content;
        });
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            const pinyinKeyword = pinyin(keyword, {toneType:'num'});
            const r1 = ctx.subtitleDao.findLineIdByClipIdAndContent(clipId, keyword);
            const r2 = ctx.subtitleDao.findLineIdByClipIdAndPinyinContent(clipId, pinyinKeyword);
            r1.forEach(item => {
                const subtitle = r[item.lineId - 1];
                subtitle.matchMode = 1;
                subtitle.markedContent = subtitle.markedContent.replaceAll(keyword, `[${keyword}]`);
            });
            r2.forEach(item => {
                const subtitle = r[item.lineId - 1];
                let sum = 0;
                let whitespaceTable = new Array(subtitle.pinyinContent.length);
                for (let i = 0; i < subtitle.pinyinContent.length; i++) {
                    whitespaceTable[i] = sum;
                    if (subtitle.pinyinContent.charCodeAt(i) === ' '.charCodeAt(0)) {
                        sum++;
                    }
                }
                
                let pinyinIndex = 0;
                while (pinyinIndex !== -1) {
                    pinyinIndex = subtitle.pinyinContent.indexOf(pinyinKeyword, pinyinIndex + 1);
                    if (pinyinIndex !== -1) {
                        const index = whitespaceTable[pinyinIndex];
                        const matchedKeyword = subtitle.content.substring(index, index + keyword.length);
                        if (matchedKeyword !== keyword) {
                            subtitle.markedContent = subtitle.markedContent.replaceAll(`<${matchedKeyword}>`, matchedKeyword);
                            subtitle.markedContent = subtitle.markedContent.replaceAll(matchedKeyword, `<${matchedKeyword}>`);
                        }
                    }
                }

                if (!subtitle.matchMode) {
                    subtitle.matchMode = 2;
                }
            });
        }
        r.forEach(item => {
            delete item.content;
            delete item.pinyinContent;
        });
        return r;
    }
}