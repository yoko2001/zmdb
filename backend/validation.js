export default {
    organizations: {
        name: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    authors: {
        name: {
            lowerLimit: 1,
            upperLimit: 30
        }
    },
    clips: {
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
        authors: {
            lowerLimit: 1,
            upperLimit: 10
        },
        content: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    subtitles: {
        content: {
            lowerLimit: 1
        }
    },
    records:{
        target: {
            range: ['organizations', 'authors', 'clips', 'subtitles']
        },
        type: {
            range: ['insert', 'update', 'delete']
        },
        remark: {
            upperLimit: 200
        },
        comment: {
            upperLimit: 200
        }
    }
}