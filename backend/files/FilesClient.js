import { access, unlink, writeFile, rename } from 'fs/promises';
import Sharp from "sharp";
import config from '../config.js';

export default class FilesClient {

    constructor() {}

    save = async (path, content) => {
        await writeFile(`${config.web.staticDir}/${path}`, content);
    }

    move = async (src, dst) => {
        const srcPath = `${config.web.tmpDir}/${src}`;
        const dstPath = `${config.web.staticDir}/${dst}`;
        await rename(srcPath, dstPath)
    }

    delete = async (src) => {
        try {
            const srcPath = `${config.web.staticDir}/${src}`;
            await unlink(srcPath);
        } catch (e) {}
    }

    changeImageType = async (src) => {
        const dst = src.substring(0, src.lastIndexOf('.')) + '.' + config.web.imageType;
        await Sharp(`${config.web.tmp}/${src}`).toFile(`${config.web.tmp}/${dst}`);
    }

}