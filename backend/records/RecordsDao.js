export default class RecordsDao {
    
    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS record(id INTEGER PRIMARY KEY AUTOINCREMENT, datetime TEXT NOT NULL, target TEXT NOT NULL, type INTEGER NOT NULL, entity TEXT NOT NULL, remark TEXT NOT NULL DEFAULT "", comment TEXT NOT NULL DEFAULT "", verified INTEGER NOT NULL DEFAULT 0)';
        this.db.exec(sql);
    }

    insert = (record) => {
        const sql = 'INSERT INTO record(datetime, target, type, entity, remark) VALUES(@datetime, @target, @type, @entity, @remark)';
        const stmt = this.db.prepare(sql);
        return stmt.run(record);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM record WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    update = (record) => {
        const sql = 'UPDATE record SET verified=@verified, comment=@comment WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(record);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM record WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findByTarget = (target) => {
        const sql = 'SELECT * FROM record WHERE target=? ORDER BY verified ASC, datetime DESC';
        const stmt = this.db.prepare(sql);
        return stmt.all(target);
    }
}
