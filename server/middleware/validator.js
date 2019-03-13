import Joi from 'joi';

export default class Validator {
    static schemaSignUp(user) {
        const userSchema ={
            name: Joi.string().required(),
            email : Joi.string().email().required(),
            password : Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required(),
            confirmPassword : Joi.string().valid(Joi.ref('password')).required().strict(),
        }
        return Joi.validate(user, userSchema);
    }

    static schemaSignIn(user) {
        const userSchema ={
            name: Joi.string().required(),
            email : Joi.string().email().required(),
            password : Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required(),
        }
        return Joi.validate(user, userSchema);
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
            parentMessageId : Joi.number(),
        }
        return Joi.validate(message, schema)
    }
}