import BaseModel from './src/BaseModel';

let model = new BaseModel('jiran','1.0.0');

async function test(){
    try{
        let res = model.insert("created_at", "abc").toString();
        console.log(res);
    }catch(ex){
        console.error(ex);
    }
}

test();