export default class FilesService {

    uploadImage = async (ctx) => {
        const req = ctx.request;
        const src = req.files.file.newFilename;
        const dst = await ctx.filesClient.changeImageType(src);
        return {
            filename: dst
        }
    }
}