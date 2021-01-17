import BaseModel from './src/BaseModel';

let model = new BaseModel('jiran','1.0.0');

class User extends BaseModel{
    constructor(){
        super('jiran','1.0.0');

        this.tableName = "users";
        this.identity = "id";
    }

    fields(sql){
        sql.integer('id').primary().autoincrement();
        sql.string('name');
        sql.string('email');
        sql.string('password');
        sql.datetime('created_at');
        sql.datetime('updated_at');
    }
}

async function test(){
    try{
        let user = new User();
        await user.migrate();        
        let users = await user.all();
        console.log( users.toArray() );
    }catch(ex){
        console.error(ex);
    }
}

test();