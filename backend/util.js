class Srt {

    constructor() {}

    toTS = (time) => {
        const vec = time.split(/[:|,]/);
        const ms = parseInt(vec[3]);
        const s = parseInt(vec[2]);
        const m = parseInt(vec[1]);
        const h = parseInt(vec[0]);
        return ms + s * 1000 + m * 60 * 1000 + h * 60 * 60 * 1000;
    }

    parse = (content) => {
        let r = new Array();
        const lines = content.split('\r\n');
        for (let i = 0; i < lines.length; i += 4) {
            if (lines[i] !== '') {
                const duration = lines[i + 1].split(' --> ');
                r.push({
                    lineId: lines[i],
                    start: this.toTS(duration[0]),
                    end: this.toTS(duration[1]),
                    content: lines[i + 2]
                });
            }
        }
        return r;
    }
}
export {Srt};