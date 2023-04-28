module.exports = {

    exists(model, field){
        return async (value, validator) => {
            let key = field || validator.req.body[field]
            
            let instance = await model.findOne({ [key]: value }, { _id: 1 })        
            if(!instance){
                throw new Error(`The ${key} is does not exists`)
            }
    
        }
    },

    unique(model, key){
        return async (value, validator) => {
            
            let instance = await model.findOne({ [key]: value }, { _id: 1 })        
            if(instance){
                throw new Error(`The ${key} is already taken`)
            }
    
        }
    }


}