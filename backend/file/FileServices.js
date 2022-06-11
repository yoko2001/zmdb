export default class FileService {

    uploadImage = async (ctx) => {
        const req = ctx.request;
        const src = req.files.file.newFilename;
        const dst = await ctx.fileClient.changeImageType(src);
        return {
            filename: dst
        }
    }
}