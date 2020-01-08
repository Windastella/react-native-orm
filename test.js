import QueryBuilder from './src/QueryBuilder';
import BaseModel from './src/BaseModel';

let model = new BaseModel();

async function test(){
    try{
        let res = await model.find(2);
        console.log(res);
    }catch(ex){
        console.error(ex);
    }
}

test();