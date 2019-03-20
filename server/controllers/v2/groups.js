import db from '../../db/db'
import Validator from '../../middleware/v2/validator'

export default class GroupController{
    static create (req, res, next){
        const validate = Validator.schemaCreateGroup(req.body)
        if(validate.error){
            res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const saveAGroup = "INSERT INTO Groups(name, userid) VALUES ($1, $2) RETURNING *"
        const {userId} = req.userData
        const values = [req.body.name, userId]
        db(saveAGroup, values, (err, result) =>{
            if(err) 
                return next(err)
            if(result.rowCount == 1){
                const {id, name} = result.rows[0]
                const addUserToGroup = "INSERT INTO Members(groupid, userid, role) VALUES ($1, $2, $3) RETURNING *"
                const values = [id, userId,'administrator']
                db(addUserToGroup, values, (err, addUserResult) => {
                    if(err) 
                        return next(err)
                        let {role} = addUserResult.rows[0]
                    res.status(201).json({
                        status : 201 ,
                        data : {id, name, role}
                    })
                })
            }else{
                res.status(500).json({
                    status : 500,
                    error : "error while saving"
                })
            }
        })
    }

    static getCreated(req, res, next){
        const {userId} = req.userData
        const getCreatedGroups = "SELECT g.id, g.name, m.role FROM Groups as g INNER JOIN Members as m ON g.userid = m.userid WHERE g.userid = $1";
        const values = [userId];
        db(getCreatedGroups, values, (err, result) => {
            if(err)
                return next(err)
            if(result.rowCount > 0){
                res.status(200).json({
                    status : 200,
                    data : result.rows
                })
            }else{
                res.status(200).json({
                    status : 200,
                    data : "there is no group for you"
                })
            }
        })
    }

    static editName(req, res, next){
        res.send("not yet done")
    }

    static delGroup(req, res, next){
        res.send("not yet done")
    }

    static addUser(req, res, next){
        res.send("not yet done")
    }

    static delUser(req, res, next){
        res.send("not yet done")
    }

    static sendMessage(req, res, next){
        res.send("not yet done")
    }
}