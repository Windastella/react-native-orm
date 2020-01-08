import Platform from './JsPlatform';

export default class Sqlite{
    constructor(dbname, dbversion){
        if(Platform() == 'node'){
            this.sqlite = require('sqlite3');

            this.db = new this.sqlite.Database(`${dbname}_${dbversion}.db`);
        } else if (Platform() == 'rn') {
            this.sqlite = require('react-native-sqlite-storage');

            this.db = this.sqlite.openDatabase(`${dbname}_${dbversion}.db`, dbversion);
        }
    }

    query( sql, params = [] ){
        if(Platform() == 'rn'){
            return new Promise((resolve, reject)=>{
                this.db.transaction(txn=>{
                  txn.executeSql(sql, params, 
                  (tx, res) =>{
                    resolve(res.rows.raw());
                  },
                  reject);
                }, reject);
            });
        }else if(Platform() == 'node'){
            return new Promise((resolve, reject)=>{
                this.db.all(sql, params, (err, rows)=>{
                    if(err)
                        reject(err)
                    else
                        resolve(rows) 
                });
            });
        }
    }

    // react-native-sqlite-storage transaction
    transaction(trxFunc = ()=>{}){
        return new Promise((resolve, reject)=>{
          this.sqlite.transaction(trxFunc, reject, resolve);
        });
    }
}