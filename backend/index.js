import Database from 'better-sqlite3';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import config from './config.js';
import { Srt } from './utils.js'
import { errorHandler, auth } from './middlewares.js';
import FilesClient from './files/FilesClient.js';
import OrganizationDao from './organization/OrganizationDao.js';
import AuthorDao from './author/AuthorDao.js';
import ClipDao from './clip/ClipDao.js';
import SubtitlesDao from './subtitles/SubtitlesDao.js'
import OrganzationService from './organization/OrganizationService.js';
import AuthorService from './author/AuthorService.js';
import ClipService from './clip/ClipService.js';
import SubtitlesService from './subtitles/SubtitlesService.js';
import FilesService from './files/FilesServices.js';

const app = new Koa({ proxy: true });
const router = new Router();

const db = new Database(config.db.path, { verbose: console.log });

app.context.srt = new Srt();
app.context.filesClient = new FilesClient();

app.context.organizationDao = new OrganizationDao(db);
app.context.authorDao = new AuthorDao(db);
app.context.clipDao = new ClipDao(db);
app.context.subtitlesDao = new SubtitlesDao(db);

app.context.organizationService = new OrganzationService();
app.context.authorService = new AuthorService();
app.context.clipService = new ClipService();
app.context.subtitlesService = new SubtitlesService();
app.context.filesService = new FilesService();

/**
 * files
 */
router.post('/files/image', auth, async ctx => {
    ctx.body = await ctx.filesService.uploadImage(ctx);
});

/**
 * organization
 */
router.post('/organizations', auth, async ctx => {
    ctx.body = await ctx.organizationService.insert(ctx);
});
router.put('/organizations/:id', async ctx => {
    ctx.body = await ctx.organizationService.update(ctx);
});
router.get('/organizations', async ctx => {
    ctx.body = await ctx.organizationService.findAll(ctx) || [];
});

/**
 * authors
 */
router.get('/organizations/:organizationId/authors', async ctx => {
    ctx.body = await ctx.authorService.findByOrganizationId(ctx);
});
router.get('/authors', async ctx => {
    ctx.body = await ctx.authorService.findAll(ctx);
});

/**
 * clips
 */
router.get('/organizations/:organizationId/clips', async ctx => {
    ctx.body = await ctx.clipService.findByOrganizationId(ctx);
});
router.get('/clips', async ctx => {
    ctx.body = await ctx.clipService.find(ctx);
})

/**
 * subtitles
 */
router.get('/clips/:clipId/subtitles', async ctx => {
    ctx.body = await ctx.subtitlesService.findByClipId(ctx) || [];
});

app.use(cors());

app.use(errorHandler);
app.use(koaBody({ 
    jsonLimit: config.web.bodyLimit, 
    formLimit: config.web.bodyLimit,
    multipart: true,
    formidable: {
        uploadDir: config.web.tmpDir,
        keepExtensions: true
    }
}));
app.use(router.routes());

app.listen(config.web.port);