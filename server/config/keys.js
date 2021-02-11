if(process.env.NODE_ENV==='production'){ //NODE_ENV is protected in .env file
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}
