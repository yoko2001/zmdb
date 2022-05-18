export const validation = {
    organization: {
        name: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    vup: {
        name: {
            lowerLimit: 1,
            upperLimit: 30
        }
    },
    live: {
        title: {
            lowerLimit: 1,
            upperLimit: 20
        },
        bv: {
            limit: 12
        },
        datetime: {
            limit: 19
        },
        vupIds: {
            lowerLimit: 1,
            upperLimit: 10
        },
        content: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    subtitle: {
        content: {
            lowerLimit: 1
        }
    }
};

export const error = {
    organizationNameLengthTooShort: {
        error: 400100101,
        message: `社团名称长度不能小于${validation.organization.name.lowerLimit}字符`
    },
    organizationNameLengthTooLong: {
        error: 400100102,
        message: `社团名称长度不能大于${validation.organization.name.upperLimit}字符`
    },
    organizationNotFound: {
        error: 400100109,
        message: '社团不存在'
    },
    vupNameLengthTooShort: {
        error: 400100111,
        message: `主播昵称长度不能小于${validation.vup.name.lowerLimit}字符`
    },
    vupNameLengthTooLong: {
        error: 400100112,
        message: `主播昵称长度不能大于${validation.vup.name.upperLimit}字符`
    },
    vupNotFound: {
        error: 400100119,
        message: '主播不存在'
    },
    liveTitleLengthTooShort: {
        error: 400100121,
        message: `直播标题长度不能小于${validation.live.title.lowerLimit}字符`
    },
    liveTitleLengthTooLong: {
        error: 400100122,
        message: `直播标题长度不能大于${validation.live.title.upperLimit}字符`
    },
    liveBvFormatIllegal: {
        error: 400100123,
        message: `录播视频bv号长度必须是${validation.live.bv.limit}字符`
    },
    liveDatetimeFormatIllegal: {
        error: 400100124,
        message: `直播时间日期格式非法`
    },
    liveVerifiedIllegal: {
        error: 400100125,
        message: `字幕校验标识非法`
    },
    liveNotFound: {
        error: 400100126,
        message: '直播不存在'
    },
    liveVupIdsTooLittle: {
        error: 400100127,
        message: `查询的主播数量不应该小于${validation.live.vupIds.lowerLimit}个`
    },
    liveVupIdsTooMuch: {
        error: 400100128,
        message: `查询的主播数量不应该大于${validation.live.vupIds.upperLimit}个`
    },
    liveContentLengthTooShort: {
        error: 400100129,
        message: `搜索词长度不能小于${validation.live.content.lowerLimit}字符`
    },
    liveContentLengthTooLong: {
        error: 400100130,
        message: `搜索词长度不能大于${validation.live.content.upperLimit}字符`
    },
    subtitleContentLengthTooShort: {
        error: 400100141,
        message: `字幕内容不能小于${validation.subtitle.content.lowerLimit}字符`
    },
    subtitleContentParseError: {
        error: 400100142,
        message: `字幕文本解析错误`
    },
    subtitleNotFound: {
        error: 400100149,
        message: '字幕不存在'
    },
    sqliteError: {
        error: 500100000,
        message: ''
    },
    QiniuError: {
        error: 500100001,
        message: ''
    }
};