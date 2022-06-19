import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import config from './config.js';
// import { errorHandler, auth } from './middlewares.js';
import TaskService from './TaskService.js';

const app = new Koa({ proxy: true });
const router = new Router();

app.context.taskService = new TaskService();

/**
 * tasks
 */
 router.post('/tasks', async ctx => {
    ctx.body = await ctx.taskService.insert(ctx);
});

app.use(koaBody({ 
    jsonLimit: config.web.bodyLimit
}));
app.use(cors());
// app.use(errorHandler);
app.use(router.routes());

app.listen(config.web.port);