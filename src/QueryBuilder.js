import DataType from './DataType';

export default class QueryBuilder {
    constructor(){
        this.sql = [];

        this.tableName = "master";
        this.identity = "id";
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
    createTable(func){        
        func(this);

        for(let i = 0; i < this.sql.length - 1; i++ )
            this.sql[i].push(",");

        this.sql.unshift(['CREATE', 'TABLE', 'IF NOT EXISTS', this.tableName, "("]);
        this.sql.push([")"]);
        return this;
    }

    // column type
    string(field){
        this.sql.push([field, DataType.TEXT]);
        this[field];
        return this;
    }

    numeric(field){
        this.sql.push([field, DataType.NUMERIC]);
        this[field];
        return this;
    }

    integer(field){
        this.sql.push([field, DataType.INTEGER]);
        this[field];
        return this;
    }

    real(field){
        this.sql.push([field, DataType.REAL]);
        this[field];
        return this;
    }

    datetime(field){
        this.sql.push([field, DataType.DATETIME]);
        this[field];
        return this;
    }

    blob(field){
        this.sql.push([field, DataType.BLOB]);
        this[field];
        return this;
    }

    boolean(field){
        this.sql.push([field, DataType.INTEGER]);
        this[field];
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

    // order by
    orderBy(field, asc = true){
        this.sql.push(['ORDER BY', field, asc?'ASC':'DESC' ]);
        return this;
    }

    // insert
    insert(fields, values = null){
        this.sql.push(['INSERT INTO', this.tableName+'('])

        if(Array.isArray(fields)){
            for(let i = 0; i<fields.length; i++){
                this.sql.push( [ fields[i][0] ]);
                if(i < fields.length - 1)
                    this.sql.push([',']);
            }

            this.sql.push([')', 'VALUES', '(']);

            for(let i = 0; i<fields.length; i++){
                this.sql.push([ typeof fields[i][1] == 'string' ?`\'${fields[i][1]}\'` : fields[i][1] ]);
                if(i < fields.length - 1)
                    this.sql.push([',']);
            }
        }else{
            this.sql.push([fields, ')', 'VALUES', '(', typeof values == 'string' ?`\'${values}\'` : values]);
        }

        this.sql.push([')']);

        return this;
    }
}