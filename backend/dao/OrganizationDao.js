
class OrganizationDao {
    constructor(db) {
        this.db = db;
    }

    init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS organization (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)';
        this.db.exec(sql);
    }

    insert = (dto) => {
        const sql = 'INSERT INTO organization(name) VALUES(?)';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto.name);
    }

    update = (dto) => {
        const sql = 'UPDATE organization SET name=@name WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(dto);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM organization WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM organization WHERE id = ?';
        const stmt = this.db.prepare(sql);
        return this.__toDTO(stmt.get(id));
    }

    findAll = () => {
        const sql = 'SELECT * FROM organization ORDER BY id ASC';
        const stmt = this.db.prepare(sql);
        return stmt.all().map(po => this.__toDTO(po));
    }

    __toDTO = (po) => {
        if (!po) {
            return undefined;    
        }
        return {
            id : po.id,
            name : po.name        };
    }
}

export default OrganizationDao;
