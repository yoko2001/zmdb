import qiniu from 'qiniu';
import config from '../config.js';

class QiniuClient {

    constructor(accessKey, secretKey, bucket) {
        this.bucket = bucket;
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        this.putPolicy = new qiniu.rs.PutPolicy({ scope: bucket, expires: 10 });

        const config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z2;
        
        this.manager = new qiniu.rs.BucketManager(this.mac, config);
        this.uploader = new qiniu.form_up.FormUploader(config);
        this.cdn = new qiniu.cdn.CdnManager(this.mac);
    }

    find = async (key) => {
        return await new Promise((res, rej) => {
            this.manager.stat(this.bucket, key, (respErr, respBody, respInfo) => {
                if (respErr) {
                    rej(respErr);
                } else {
                    res(respBody);
                }
            })
        });
    }

    delete = async (key) => {
        return await new Promise((res, rej) => {
            this.manager.delete(this.bucket, key, (respErr, respBody, respInfo) => {
                if (respErr) {
                    rej(respErr);
                } else {
                    res(respBody);
                }
            })
        });
    }

    upload = async (key, value) => {
        const uploadToken = this.putPolicy.uploadToken(this.mac);
        const putExtra = new qiniu.form_up.PutExtra();
        return await new Promise((res, rej) => {
            this.uploader.put(uploadToken, key, value, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    rej(respErr);
                } else {
                    res(respBody);
                }
            });
        });
    }

    refresh = async (key) => {
        const url = `${config.qiniu.baseUrl}/${key}`;
        return await new Promise((res, rej) => {
            this.cdn.refreshUrls([url], (respErr, respBody, respInfo) => {
                if (respErr) {
                    rej(respErr);
                } else {
                    res(respBody);
                }
            });
        });
    }

    forceUpload = async (key, value) => {
        const r1 = await this.find(key) || {};
        if (!r1.error) {
            // 如果存在同名文件，首先删除
            const r2 = await this.delete(key) || {};
            console.log(r2);
            if (r2.error) {
                // 删除失败返回
                return r2;
            }
        }
        const r3 = await this.upload(key, value) || {};
        if (!r3.error) {
            if (!r1.error) {
                // 如果之前存在同名文件，则需要刷新cdn
                await this.refresh(key) || {};
            }
        }
        return r3;
    }
}

export default QiniuClient;