
class SubtitleDao {
    constructor(db) {
        this.db = db;
    }

    init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS subtitle (live_id INTEGER NOT NULL, line_id INTEGER NOT NULL, start INTEGER NOT NULL, end INTEGER NOT NULL, content TEXT NOT NULL, PRIMARY KEY (live_id, line_id))';
        this.db.exec(sql);
    }

    insertByLiveId = (liveId, dtos) => {
        const sql = 'INSERT INTO subtitle(live_id, line_id, start, end, content) VALUES(?, ?, ?, ?, ?)';
        const stmt = this.db.prepare(sql);
        return this.db.transaction(items => {
            items.forEach(item => {
                stmt.run(liveId, item.lineId, item.start, item.end, item.content);
            });
        })(dtos);
    }

    update = (dto) => {
        const sql = 'UPDATE subtitle SET start=@start, end=@end, content=@content WHERE live_id=@liveId AND line_id=@lineId';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto);
    }

    deleteByLiveId = (liveId) => {
        const sql = 'DELETE FROM subtitle WHERE live_id = ?';
        const stmt = this.db.prepare(sql);
        return stmt.run(liveId);
    }

    findByLiveIdAndLineId = (liveId, lineId) => {
        const sql = 'SELECT * FROM subtitle WHERE live_id = ? AND line_id = ?';
        const stmt = this.db.prepare(sql);
        return this.__toDTO(stmt.get(liveId, lineId));
    }

    findByLiveId = (liveId) => {
        const sql = 'SELECT * FROM subtitle WHERE live_id = ? ORDER BY line_id ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all(liveId).map(po => this.__toDTO(po));
    }

    __toDTO = (po) => {
        if (!po) {
            return undefined;
        }
        return {
            liveId : po.live_id,
            lineId : po.line_id,
            start : po.start,
            end : po.end,
            content : po.content
        }
    }
}

export default SubtitleDao;
