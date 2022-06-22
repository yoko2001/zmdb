export default {
    organization: {
        name: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    author: {
        name: {
            lowerLimit: 1,
            upperLimit: 30
        }
    },
    clip: {
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
    subtitle: {
        content: {
            lowerLimit: 1
        }
    },
    task: {
        interval: {
            lowerLimit: 30000,
            upperLimit: 600000
        }
    }
}