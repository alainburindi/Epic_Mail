import Joi from 'joi';

export default class Validator {
    static schemaCreateGroup(group) {
        const groupSchema ={
            name: Joi.string().required(),
        }
        return Joi.validate(group, groupSchema);
    }

    static schemaParamsId (params){
        const idSchema = {
            id : Joi.number().min(1),
        }
        return Joi.validate(params, idSchema)
    }

    static schemaMessage(message){
        const schema = {
            subject : Joi.string().default('no-subject'),
            message : Joi.string().required(),
            to : Joi.string().email().required(),
            parentMessageId : Joi.number(),
        }
        return Joi.validate(message, schema)
    }

    static schemaGroupUser(user){
        const schema = {
            role : Joi.string().required(),
            email : Joi.string().email().required(),
        }
        return Joi.validate(user, schema)
    }
}