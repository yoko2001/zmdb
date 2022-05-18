
class LiveDao {
    constructor(db) {
        this.db = db;
    }

    __toDTO = (po) => {
        if (!po) {
            return undefined;
        }
        return {
            id: po.id,
            vupId: po.vup_id,
            title: po.title,
            bv: po.bv,
            verified: po.verified,
            datetime: po.datetime
        }
    }

    init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS live (id INTEGER PRIMARY KEY AUTOINCREMENT, vup_id INTEGER NOT NULL, title TEXT NOT NULL, bv TEXT NOT NULL UNIQUE, verified INTEGER NOT NULL, datetime TEXT NOT NULL)';
        this.db.exec(sql);
        const indexSql = 'CREATE INDEX IF NOT EXISTS datetime_idx ON live (datetime)';
        this.db.exec(indexSql);
    }

    insert = (dto) => {
        const sql = 'INSERT INTO live(vup_id, title, bv, verified, datetime) VALUES(?, ?, ?, ?, ?)';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto.vupId, dto.title, dto.bv, dto.verified, dto.datetime);
    }

    update = (dto) => {
        const sql = 'UPDATE live SET vup_id=@vupId, title=@title, bv=@bv, verified=@verified, datetime=@datetime WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM live WHERE id = ?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM live WHERE id = ?';
        const stmt = this.db.prepare(sql);
        return this.__toDTO(stmt.get(id));
    }

    findByVupId = (vupId) => {
        const sql = 'SELECT * FROM live WHERE vup_id = ? ORDER BY datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(vupId).map(po => this.__toDTO(po));
    }

    findByOrganizationId = (organizationId) => {
        const sql = `SELECT live.* FROM live LEFT JOIN vup ON live.vup_id = vup.id LEFT JOIN organization ON vup.organization_id = organization.id WHERE organization.id = ? ORDER BY live.datetime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(po => this.__toDTO(po));
    }

    findByVupIdsAndContent = (vupIds, content) => {
        const sql = `SELECT DISTINCT(live.id), live.* FROM live LEFT JOIN subtitle ON live.id = subtitle.live_id WHERE live.vup_id IN (${vupIds.join(',')}) AND subtitle.content LIKE ? ORDER BY live.datetime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all('%' + content + '%').map(po => this.__toDTO(po));
    }
}

export default LiveDao;
