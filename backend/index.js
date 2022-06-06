import Database from 'better-sqlite3';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import config from './config.js';
import { Srt } from './utils.js'
import { errorHandler, auth } from './middlewares.js';
import FilesClient from './files/FilesClient.js';
import OrganizationsDao from './organizations/OrganizationsDao.js';
import AuthorsDao from './authors/AuthorsDao.js';
import ClipsDao from './clips/ClipsDao.js';
import SubtitlesDao from './subtitles/SubtitlesDao.js'
import RecordsDao from './records/RecordsDao.js';
import OrganzationsService from './organizations/OrganizationsService.js';
import AuthorsService from './authors/AuthorsService.js';
import ClipsService from './clips/ClipsService.js';
import SubtitlesService from './subtitles/SubtitlesService.js';
import RecordsService from './records/RecordsService.js';
import FilesService from './files/FilesServices.js';

const app = new Koa({ proxy: true });
const router = new Router();

const db = new Database(config.db.path, { verbose: console.log });

app.context.srt = new Srt();
app.context.filesClient = new FilesClient();

app.context.organizationsDao = new OrganizationsDao(db);
app.context.authorsDao = new AuthorsDao(db);
app.context.clipsDao = new ClipsDao(db);
app.context.subtitlesDao = new SubtitlesDao(db);
app.context.recordsDao = new RecordsDao(db);

app.context.organizationsService = new OrganzationsService();
app.context.authorsService = new AuthorsService();
app.context.clipsService = new ClipsService();
app.context.subtitlesService = new SubtitlesService();
app.context.recordsService = new RecordsService();
app.context.filesService = new FilesService();

/**
 * files
 */
router.post('/files/image', async ctx => {
    ctx.body = await ctx.filesService.uploadImage(ctx);
});

/**
 * organizations
 */
router.get('/organizations', async ctx => {
    ctx.body = await ctx.organizationsService.findAll(ctx) || [];
});

/**
 * authors
 */
router.get('/organizations/:organizationId/authors', async ctx => {
    ctx.body = await ctx.authorsService.findByOrganizationId(ctx);
});
router.get('/authors', async ctx => {
    ctx.body = await ctx.authorsService.findAll(ctx);
});

/**
 * clips
 */
router.get('/organizations/:organizationId/clips', async ctx => {
    ctx.body = await ctx.clipsService.findByOrganizationId(ctx);
});
router.get('/clips', async ctx => {
    ctx.body = await ctx.clipsService.find(ctx);
})

/**
 * subtitles
 */
router.get('/clips/:clipId/subtitles', async ctx => {
    ctx.body = await ctx.subtitlesService.findByClipId(ctx) || [];
});

/**
 * records
 */
router.post('/records', async ctx => {
    ctx.body = await ctx.recordsService.insert(ctx);
});
router.delete('/records/:id', async ctx => {
    ctx.body = await ctx.recordsService.deleteById(ctx);
});
router.put('/records/:id/verified/:verified', auth, async ctx => {
    const verified = parseInt(ctx.params.verified);
    if (verified === 1) {
        await ctx.recordsService.verify(ctx);
    } else if (verified === 2) {
        await ctx.recordsService.close(ctx);
    }
});
router.get('/records/:target', async ctx => {
    ctx.body = await ctx.recordsService.findByTarget(ctx) || {};
})

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(errorHandler);
app.use(koaBody({ 
    jsonLimit: config.web.bodyLimit, 
    formLimit: config.web.bodyLimit,
    multipart: true,
    formidable: {
        uploadDir: config.web.tmp,
        keepExtensions: true
    }
}));
app.use(router.routes());

app.listen(config.web.port);