import DataType from './DataType';

export default class QueryBuilder {
    constructor(){
        this.sql = [];
    }

    toString(){
        let sqlquery = "";
        
        for(let i = 0; i < this.sql.length; i++){
            sqlquery += " " + this.sql[i].join(' ');
        }

        this.clear();

        return sqlquery;
    }

    clear(){
        this.sql = [];
    }
    //table builder
    create(tableName, func ){        
        func(this);

        for(let i = 0; i < this.sql.length - 1; i++ )
            this.sql[i].push(",");

        this.sql.unshift(['CREATE', 'TABLE', 'IF NOT EXISTS', tableName, "("]);
        this.sql.push([")"]);
        return this;
    }

    // column type
    string(field){
        this.sql.push([field, DataType.TEXT]);
        return this;
    }

    numeric(field){
        this.sql.push([field, DataType.NUMERIC]);
        return this;
    }

    integer(field){
        this.sql.push([field, DataType.INTEGER]);
        return this;
    }

    real(field){
        this.sql.push([field, DataType.REAL]);
        return this;
    }

    datetime(field){
        this.sql.push([field, DataType.DATETIME]);
        return this;
    }

    blob(field){
        this.sql.push([field, DataType.BLOB]);
        return this;
    }

    boolean(field){
        this.sql.push([field, DataType.INTEGER]);
        return this;
    }

    //key
    primary(){
        this.sql[this.sql.length - 1].push('PRIMARY KEY');
        return this;
    }

    autoincrement(){
        this.sql[this.sql.length - 1].push('AUTOINCREMENT');
        return this;
    }

    notnull(){
        this.sql[this.sql.length - 1].push('NOT NULL');
        return this;
    }

    // query
    where(field, operator, operand = null){
        let query = ['WHERE'];

        query.push(field);

        if(!operand){
            query.push('=');
            operand = operator
        }
        else
            query.push(operator);  

        if(typeof operand == 'string')
            query.push(`\'${operand}\'`);
        else
            query.push(operand);

        if(this.sql.length > 0 && this.sql[this.sql.length - 1][0] == 'WHERE')
            this.sql.push(['AND']);

        this.sql.push(query);

        return this;
    }

    orWhere(field, operator, operand = null){
        let query = ['WHERE'];

        query.push(field);

        if(!operand){
            query.push('=');
            operand = operator
        }
        else
            query.push(operator);  

        if(typeof operand == 'string')
            query.push(`\'${operand}\'`);
        else
            query.push(operand);

        if(this.sql.length > 0 && this.sql[this.sql.length - 1][0] == 'WHERE')
            this.sql.push(['OR']);

        this.sql.push(query);

        return this;
    }
}