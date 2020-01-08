import Sqlite from './Sqlite';
import Env from '../env.json';
import QueryBuilder from './QueryBuilder';

export default class BaseModel extends QueryBuilder {
    constructor(dbname, dbversion){
        super();

        this.db = new Sqlite(dbname, dbversion);

        this.dbname = dbname;
        this.dbversion = dbversion;
        this.tableName = "master";
        this.identity = "id";

        this.migrate();
    }

    async migrate(){
        let sqlquery = this.createTable( this.fields ).toString();       
        this.db.query(sqlquery);
    }

    fields(sql){
        sql.integer('id').primary().autoincrement();
        sql.datetime('created_at');
        sql.datetime('updated_at');
    }

    async run(){
        let sqlquery = this.toString();
        let array = await this.db.query(sqlquery);
        
        return array.map((obj,index)=>{
            let model = new that.constructor(that.dbname, that.dbversion);

            
            let keys = Object.keys(obj);

            for(let i = 0; i < keys.length; i++){
                model[keys[i]] = obj[keys[i]];
            }

            return model;
        });
    }

    async get(){        
        let that = this;

        this.sql.unshift(['SELECT','*','FROM',this.tableName]);

        return this.run();
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