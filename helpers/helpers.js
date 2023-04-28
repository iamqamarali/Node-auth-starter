const path = require('path');

module.exports = {
        
    public_path : function(...args){
        return path.join(__dirname, '../public', ...args)
    }

}