import { stat } from 'fs/promises';
import exec from 'child_process';
// import error from "./error.js";
// import validation from "./validation.js";
import { toTime } from './util.js';

const Status = {
    SUBMIT: 1,
    DOWNLOADING: 2,
    DOWNLOADED: 3,
    PUSH: 4 
};

export default class TaskService {

    constructor() {
        this.tasks = new Map();
    }

    /**
     * @param {task} 任务实例 
     */
    insert = async (ctx) => {
        const { task } = ctx.request.body;
        console.log(task);

        const filepath = `cache/video/${task.clipId}.mp4`;
        console.log(`filepath:${filepath}`);
        tasks.set(task.id, async () => {
            if (!await stat(filepath)) {
            }
            const startTime = toTime(task.start);
            const endTime = toTime(task.end);
            const output = `tmp/${clipId}-${startTime}-${endTime}.mp4`;
            exec.exec(`ffmpeg -i "${filepath}" -ss ${startTime} -to ${endTime} ${output}`, (error, stdout, stderr) => {
                console.log(error);
                console.log(stdout);
                console.log(stderr);
            });
        });
        return {};
    }
}