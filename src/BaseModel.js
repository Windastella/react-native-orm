import SQLite from "react-native-sqlite-2";
import Env from '../env.json';
import QueryBuilder from './QueryBuilder';

export default class BaseModel extends QueryBuilder {
    constructor(){
        this.db = SQLite.openDatabase(`${Env.db.name}_${Env.db.version}.db`, Env.db.version);

        this.tableName = "master";
        this.identity = "id";

        this.migrate();
    }

    async migrate(){
        this.query(this.create(this.tableName. this.fields));
        this.clear();
    }

    fields(sql){
        sql.integer('id').primary().autoincrement();
        sql.datetime('created_at');
        sql.datetime('updated_at');
    }

    query( sql, params = [] ){
        return new Promise((resolve, reject)=>{
          this.db.transaction(txn=>{
            txn.executeSql(sql, params, 
            (tx, res) =>{
              resolve(res);
            },
            reject);
          }, reject);
        });
    }

    transaction(trxFunc = ()=>{}){
        return new Promise((resolve, reject)=>{
          this.db.transaction(trxFunc, reject, resolve);
        });
    }

    async get(){
        let sqlquery = "";
        
        this.sql.unshift(['SELECT','*','FROM',this.tableName]);

        for(sql in this.sql){
            sqlquery += " ".sql.join(' ');
        }

        this.clear();

        return await this.query(sqlquery);
    }

    async find(id){
        this.where(this.identity, '=', id);
        
        return await this.get();
    }
}