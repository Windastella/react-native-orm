import QueryBuilder from './src/QueryBuilder';

let qb = new QueryBuilder();

console.log(qb.create('users',function(sql){
    sql.integer('id').primary().notnull().autoincrement();
    sql.datetime('created_at');
    sql.datetime('updated_at');
}).toString());