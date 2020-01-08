import Sqlite from './Sqlite';
import QueryBuilder from './QueryBuilder';

class ModelArray extends Array {
    constructor(...args) { 
        super(...args); 
    }

    toArray(){
        return this.map((obj, i)=>{
            if(obj instanceof BaseModel)
                return obj.json();
        });
    }
}

export default class BaseModel extends QueryBuilder {
    constructor(dbname, dbversion){
        super();

        this.db = new Sqlite(dbname, dbversion);

        this.dbname = dbname;
        this.dbversion = dbversion;
        this.tableName = "master";
        this.identity = "id";
    }

    async migrate(){
        let sqlquery = this.createTable( this.fields ).toSqlString();       
        this.db.query(sqlquery);
    }

    fields(sql){
        sql.integer('id').primary().autoincrement();
        sql.datetime('created_at');
        sql.datetime('updated_at');
    }

    async run(){
        let that = this;

        let sqlquery = this.toSqlString();
        let array = await this.db.query(sqlquery);
        
        array = array.map((obj,index)=>{
            let model = new that.constructor(that.dbname, that.dbversion);

            let keys = Object.keys(obj);
            
            for(let i = 0; i < keys.length; i++){
                model[keys[i]] = obj[keys[i]];
            }

            return model;
        });

        let modelArray = new ModelArray(...array);

        return modelArray;
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
        this.orderBy(this.identity,false);
        this.sql.push(['LIMIT', 1]);
        
        return (await this.get())[0];
    }

    async all(){
        return this.get();
    }

    async save(){

        if(this[this.identity]){
            let arr = [];
            let keys = this.keys || [];
            

            for(let i = 0; i < keys.length; i++){
                if(this[keys[i]])
                    arr.push([keys[i], this[keys[i]] ]);
                
            }

            if(arr.length == 0)
                throw { message:"Empty Model" };

            this.update(this[this.identity], arr );
        }else{
            let arr = [];
            let keys = this.keys || [];
            for(let i = 0; i < keys.length; i++){
                if(this[keys[i]])
                    arr.push([ keys[i], this[keys[i]] ]);
            }

            if(arr.length == 0)
                throw { message:"Empty Model" };

            this.insert( arr );
        }
        this.run();

        let model = await this.first();
        
        let keys = this.keys || [];
        for(let i = 0; i < keys.length; i++){
            this[keys[i]] = model[keys[i]];
        }

        return this;
    }

    // relationship
    async belongsTo(model, foreignkey, localkey){
        return model.find(this[foreignkey]);
    }

    async hasOne(model, foreignkey, localkey){
        return model.where(foreignkey, this[localkey]).first();
    }

    async hasMany(model, foreignkey, localkey){
        return model.where(foreignkey, this[localkey]).get();
    }

    // serialization
    json(){
        let json = {};

        let keys = this.keys || [];
        for(let i = 0; i < keys.length; i++){
            if(this[keys[i]])
                json[keys[i]] = this[keys[i]];
        }

        return json;
    }
}