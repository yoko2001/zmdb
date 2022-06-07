export default class AuthorDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS author(id INTEGER PRIMARY KEY AUTOINCREMENT, organizationId INTEGER NOT NULL, uid INTEGER NOT NULL UNIQUE, name TEXT NOT NULL UNIQUE)';
        this.db.exec(sql);
    }

    insert = (author) => {
        const sql = 'INSERT INTO author(organizationId, uid, name) VALUES(@organizationId, @uid, @name)';
        const stmt = this.db.prepare(sql);
        return stmt.run(author);
    }

    update = (author) => {
        const sql = 'UPDATE author SET organizationId=@organizationId, uid=@uid, name=@name WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(author);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM author WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = 'SELECT * FROM author WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    findByOrganizationId = (organizationId) => {
        const sql = 'SELECT ' + 
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name ' +
                    'FROM author ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'WHERE organizationId=? ' +
                    'ORDER BY author.id ASC';

        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(item => {
            return {
                id: item.author_id,
                organizationId: item.author_organizationId,
                uid: item.author_uid,
                name: item.author_name,
                organization: {
                    id: item.organization_id,
                    name: item.organization_name
                }
            }
        });
    }

    findAll = () => {
        const sql = 'SELECT ' +
                        'author.id as author_id, ' +
                        'author.organizationId as author_organizationId, ' +
                        'author.uid as author_uid, ' +
                        'author.name as author_name, ' +
                        'organization.id as organization_id, ' +
                        'organization.name as organization_name ' +
                    'FROM author ' +
                    'LEFT JOIN organization ON author.organizationId=organization.id ' +
                    'ORDER BY author.id DESC';
        const stmt = this.db.prepare(sql);
        const r = stmt.all();
        console.log(r);
        return stmt.all().map(item => {
            return {
                id: item.author_id,
                organizationId: item.author_organizationId,
                uid: item.author_uid,
                name: item.author_name,
                organization: {
                    id: item.organization_id,
                    name: item.organization_name
                }
            }
        });
    }
}
