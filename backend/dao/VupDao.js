
class VupDao {
    constructor(db) {
        this.db = db;
    }

    __toDTO = (po) => {
        if (!po) {
            return undefined;
        }
        return {
            id : po.id,
            organizationId : po.organization_id,
            uid : po.uid,
            name : po.name
        }
    }

    init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS vup (id INTEGER PRIMARY KEY AUTOINCREMENT, organization_id INTEGER NOT NULL, uid INTEGER NOT NULL UNIQUE, name TEXT NOT NULL UNIQUE)';
        this.db.exec(sql);
    }

    insert = (dto) => {
        const sql = 'INSERT INTO vup(organization_id, uid, name) VALUES(?, ?, ?)';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto.organizationId, dto.uid, dto.name);
    }

    update = (dto) => {
        const sql = 'UPDATE vup SET organization_id=@organizationId, uid=@uid, name=@name WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM vup WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM vup WHERE id = ?';
        const stmt = this.db.prepare(sql);
        return this.__toDTO(stmt.get(id));
    }

    findByOrganizationId = (organizationId) => {
        const sql = 'SELECT * FROM vup WHERE organization_id=? ORDER BY id ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(po => this.__toDTO(po));
    }
}

export default VupDao;
