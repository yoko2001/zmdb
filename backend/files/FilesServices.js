
export default class FilesService {

    uploadImage = async (ctx) => {
        const req = ctx.request;
        const src = req.files.file.newFilename;
        const dst = ctx.filesClient.changeImageType(src);
        return {
            filename: dst
        }
    }
}