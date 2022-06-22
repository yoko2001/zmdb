import moment from "moment";
import error from "../error.js";
import validation from "../validation.js";

const Status = {
    ERROR: 0,
    SUBMIT: 1,
    DOWNLOADING: 2,
    DOWNLOADED: 3,
    PUSH: 4 
};

export default class TaskService {

    /**
     * @param {clipId} 作品id 
     * @param {start} 开始时间
     * @param {end} 结束时间
     */
    insert = async (ctx) => {
        const { clipId, start, end } = ctx.request.body;

        let task = {};
        // 检查参数合法性
        const clip = ctx.clipDao.findById(clipId);
        if (!clip) {
            throw error.clip.NotFound;
        }
        task.clipId = clipId;

        if (start === undefined || start === '' || isNaN(start)) {
            throw error.task.start.Illegal;
        }
        task.start = start;

        if (end === undefined || end === '' || isNaN(end)) {
            throw error.task.end.Illegal;
        }
        task.end = end;

        const interval = end - start;
        if (interval < validation.task.interval.lowerLimit) {
            throw error.task.interval.TooShort;
        }
        if (interval > validation.task.interval.upperLimit) {
            throw error.task.interval.TooLong;
        }

        task.datetime = moment().format('YYYY-MM-DD h:mm:ss');
        task.status = Status.SUBMIT;

        const r = ctx.taskDao.insert(task);
        const id = r.lastInsertRowid;

        return ctx.taskDao.findById(id);
    }

    /**
     * @param {id} 任务id
     * @param {status} 状态码 
     */
    updateStatus = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const { status } = ctx.request.body;
        // 检查参数合法性
        let task = ctx.taskDao.findById(id);
        if (!task) {
            throw error.task.NotFound;
        }
        task.id = id;

        if (status === undefined) {
            throw error.task.status.Illegal;
        }
        task.status = status;

        ctx.taskDao.updateStatus(task);

        return ctx.taskDao.findById(id);
    }

    /**
     * 
     * @param {ids} 任务id列表，例如1,2,3 
     * @returns 任务列表
     */
    findByIds = (ctx) => {
        const ids = (ctx.query.ids || '').split(',').filter(item => !isNaN(item));
        return ctx.taskDao.findByIds(ids);
    }
}