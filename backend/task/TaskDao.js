export default class TaskDao {
    constructor(db) {
        this.db = db;
        this.__init();
    }
    
    __init = () => {
        const sql = 'CREATE TABLE IF NOT EXISTS task(id INTEGER PRIMARY KEY AUTOINCREMENT, clipId INTEGER NOT NULL, start INTEGER NOT NULL, end INTEGER NOT NULL, status INTEGER NOT NULL, datetime TEXT NOT NULL)';
        this.db.exec(sql);
    }

    __toDTO = (entity) => {
        return {
            id: entity.task_id,
            clipId: entity.task_clipId,
            start: entity.task_start,
            end: entity.task_end,
            status: entity.task_status,
            datetime: entity.task_datetime,
            clip: {
                id: entity.clip_id,
                authorId: entity.clip_authorId,
                title: entity.clip_title,
                bv: entity.clip_bv,
                datetime: entity.clip_datetime
            }
        };
    }

    insert = (task) => {
        const sql = 'INSERT INTO task(clipId, start, end, status, datetime) VALUES(@clipId, @start, @end, @status, @datetime)';
        const stmt = this.db.prepare(sql);
        return stmt.run(task);
    }

    updateStatus = (task) => {
        const sql = 'UPDATE task SET status=@status WHERE id=@id';
        const stmt = this.db.prepare(sql);
        return stmt.run(task);
    }

    findByIds = (ids) => {
        const sql = 'SELECT '+ 
                        'task.id AS task_id,' +
                        'task.clipId AS task_clipId,' +
                        'task.start AS task_start,' + 
                        'task.end AS task_end,' +
                        'task.status AS task_status,'+
                        'task.datetime AS task_datetime,' +
                        'clip.id AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.bv AS clip_bv,' +
                        'clip.datetime AS clip_datetime ' + 
                    'FROM task ' +
                    'LEFT JOIN clip ON task.clipId = clip.id ' +
                    `WHERE task_id IN (${ids.join(',')}) ` +
                    'ORDER BY task_status ASC, task_id DESC LIMIT 20';
        const stmt = this.db.prepare(sql);
        return stmt.all().map(item => this.__toDTO(item));
    }

    findById = (id) => {
        const sql = 'SELECT '+ 
                        'task.id AS task_id,' +
                        'task.clipId AS task_clipId,' +
                        'task.start AS task_start,' + 
                        'task.end AS task_end,' +
                        'task.status AS task_status,' +
                        'task.datetime AS task_datetime,' +
                        'clip.id AS clip_id,' +
                        'clip.authorId AS clip_authorId,' +
                        'clip.title AS clip_title,' +
                        'clip.bv AS clip_bv,' +
                        'clip.datetime AS clip_datetime ' + 
                    'FROM task ' +
                    'LEFT JOIN clip ON task.clipId = clip.id ' +
                    'WHERE task_id=?';
        const stmt = this.db.prepare(sql);
        return this.__toDTO(stmt.get(id));
    }
}
