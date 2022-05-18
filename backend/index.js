import Database from 'better-sqlite3';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import config from './config.js';
import LiveDao from './dao/LiveDao.js';
import OrganizationDao from './dao/OrganizationDao.js';
import VupDao from './dao/VupDao.js';
import SubtitleDao from './dao/SubtitleDao.js';
import OrganizationService from './service/OrganizationService.js';
import VupService from './service/VupService.js';
import LiveService from './service/LiveService.js';
import SubtitleService from './service/SubtitleService.js';
import QiniuClient from './client/QiniuClient.js';

(async () => {
    const db = new Database(config.db.path, { verbose: console.log });

    const organizationDao = new OrganizationDao(db);
    organizationDao.init();

    const vupDao = new VupDao(db);
    vupDao.init();

    const liveDao = new LiveDao(db);
    liveDao.init();

    const subtitleDao = new SubtitleDao(db);
    subtitleDao.init();

    const qiniuClient = new QiniuClient(
                            config.qiniu.accessKey, 
                            config.qiniu.secretKey, 
                            config.qiniu.bucket);

    const organizationService = new OrganizationService(organizationDao);
    const vupService = new VupService(vupDao, organizationDao);
    const liveService = new LiveService(organizationDao, vupDao, liveDao);
    const subtitleService = new SubtitleService(vupDao, liveDao, subtitleDao, qiniuClient);

    const fastify = Fastify({
        logger : true,
        bodyLimit: config.fastify.bodyLimit
    });

    fastify.register(cors, { 
        // put your options here
    });
    
    /** organization */
    fastify.post('/organization', async (req, rsp) => {
        return organizationService.insert(req, rsp);
    });
    fastify.put('/organization/:id', async (req, rsp) => {
        return organizationService.update(req, rsp);
    });
    fastify.delete('/organization/:id', async (req, rsp) => {
        return organizationService.deleteById(req, rsp);
    });
    fastify.get('/organizations', async (req, rsp) => {
        return organizationService.findAll(req, rsp);
    });

    /** vup */
    fastify.post('/organization/:organizationId/vup', async (req, rsp) => {
        return vupService.insert(req, rsp);
    });
    fastify.put('/vup/:id', async (req, rsp) => {
        return vupService.update(req, rsp);
    });
    fastify.delete('/vup/:id', async (req, rsp) => {
        return vupService.deleteById(req, rsp);
    });
    fastify.get('/organization/:organizationId/vups', async (req, rsp) => {
        return vupService.findByOrganizationId(req, rsp);
    });

    /** live */
    fastify.post('/vup/:vupId/live', async (req, rsp) => {
        return liveService.insert(req, rsp);
    });
    fastify.put('/live/:id', async (req, rsp) => {
        return liveService.update(req, rsp);
    });
    fastify.delete('/live/:id', async (req, rsp) => {
        return liveService.deleteById(req, rsp);
    });
    fastify.get('/organization/:organizationId/lives', async (req, rsp) => {
        return liveService.findByOrganizationId(req, rsp);
    });
    fastify.get('/vup/:vupId/lives', async (req, rsp) => {
        return liveService.findByVupId(req, rsp);
    });
    fastify.get('/lives', async (req, rsp) => {
        return liveService.findByVupIdsAndContent(req, rsp);
    });

    /** subtitle */
    fastify.post('/live/:liveId/subtitles', async (req, rsp) => {
        return subtitleService.insertByLiveId(req, rsp);
    });
    fastify.put('/live/:liveId/subtitle/:lineId', async (req, rsp) => {
        return subtitleService.update(req, rsp);
    });
    fastify.delete('/live/:liveId/subtitles', async (req, rsp) => {
        return subtitleService.deleteByLiveId(req, rsp);
    });
    fastify.get('/live/:liveId/subtitles', async (req, rsp) => {
        return subtitleService.findByLiveId(req, rsp);
    });


    try {
        await fastify.listen(config.fastify.port);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})()