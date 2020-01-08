import Sqlite from './Sqlite';
import Env from '../env.json';
import QueryBuilder from './QueryBuilder';

export default class BaseModel extends QueryBuilder {
    constructor(){
        super();

        this.db = new Sqlite(Env.database.name, Env.database.version);

        this.tableName = "master";
        this.identity = "id";

        this.migrate();
    }

    async migrate(){
        this.db.query(this.create(this.tableName, this.fields).toString());
        this.clear();
    }

    fields(sql){
        sql.integer('id').primary().autoincrement();
        sql.datetime('created_at');
        sql.datetime('updated_at');
    }

    async get(){
        let sqlquery = "";
        
        this.sql.unshift(['SELECT','*','FROM',this.tableName]);

        for(let i = 0; i < this.sql.length; i++){
            sqlquery += " "+this.sql[i].join(' ');
        }

        this.clear();

        return this.db.query(sqlquery);
    }

    async find(id){
        this.where(this.identity, '=', id);
        return (await this.get())[0];
    }

    async first(){
        this.sql.push(['LIMIT', 1]);
        return (await this.get())[0];
    }

    async all(){
        return this.get();
    }
}