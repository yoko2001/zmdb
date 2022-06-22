import { stat } from 'fs/promises';
import EventEmitter from 'events';
import exec from 'child_process';
import axios from 'axios';
// import error from "./error.js";
// import validation from "./validation.js";
import config from './config.js';
import { toTime } from './util.js';

const Status = {
    ERROR: 0,
    SUBMIT: 1,
    DOWNLOADING: 2,
    DOWNLOADED: 3,
    PUSH: 4
};

export default class TaskService {

    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.on('task', async (task) => {
            const filepath = `cache/video/${task.clipId}.mp4`;
            console.log(`filepath:${filepath}`);
            if (!await stat(filepath)) {
                console.log(`${filepath} not found.`);
            }
            const startTime = toTime(task.start);
            const endTime = toTime(task.end);
            const output = `tmp/${task.clipId}-${startTime}-${endTime}.mp4`;
            const cmd = `ffmpeg -i "${filepath}" -ss ${startTime} -to ${endTime} ${output}`;
            console.log(cmd);
            try {
                await new Promise((res, rej) => {
                    exec.exec(cmd, (error, stdout, stderr) => {
                        rej(error);                
                        console.log(stdout);
                        console.log(stderr);
                        res();
                    });
                });
                axios.put(`${config.api.url}/tasks/${task.id}`, {
                    status: Status.DOWNLOADED
                });
            } catch (ex) {
                console.log(error);
                axios.put(`${config.api.url}/tasks/${task.id}`, {
                    status: Status.DOWNLOADING
                });
            }
        });
    }

    /**
     * @param {task} 任务实例 
     */
    insert = async (ctx) => {
        const task = ctx.request.body;
        console.log(task);

        axios.put(`${config.api.url}/tasks/${task.id}`, {
            status: Status.SUBMIT
        });
        this.emitter.emit('task', task);
        return {};
    }
}