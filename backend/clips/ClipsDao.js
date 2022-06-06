export default class ClipsDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS clip(id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER NOT NULL, title TEXT NOT NULL, bv TEXT NOT NULL UNIQUE, datetime TEXT NOT NULL)';
        this.db.exec(sql);
    }

    insert = (clip) => {
        const sql = 'INSERT INTO clip(authorId, title, bv, datetime) VALUES(@authorId, @title, @bv, @datetime)';
        const stmt = this.db.prepare(sql);
        return stmt.run(clip);
    }

    update = (clip) => {
        const sql = 'UPDATE clip SET authorId=@authorId, title=@title, bv=@bv, datetime=@datetime WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(clip);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM clip WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM clip WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findByOrganizationId = (organizationId) => {
        const sql = `SELECT clip.* FROM clip LEFT JOIN author ON clip.authorId = author.id LEFT JOIN organization ON author.organizationId = organization.id WHERE organization.id=? ORDER BY clip.datetime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId);
    }

    findByAuthorIdsAndContent = (authorIds, content) => {
        const sql = `SELECT DISTINCT(clip.id), clip.* FROM clip LEFT JOIN subtitle ON clip.id = subtitle.clipId WHERE clip.authorId IN (${authorIds.join(',')}) AND subtitle.content LIKE ? ORDER BY clip.datetime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all('%' + content + '%');
    }

    findAll = () => {
        const sql = `SELECT * FROM clip ORDER BY id DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all();
    }
}