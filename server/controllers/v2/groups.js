import db from '../../db/db'
import Validator from '../../middleware/v2/validator'

export default class GroupController{
    static create (req, res, next){
        const validate = Validator.schemaCreateGroup(req.body)
        if(validate.error){
            return res.status(422).json({
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
                    return res.status(201).json({
                        status : 201 ,
                        data : {id, name, role}
                    })
                })
            }else{
                return res.status(500).json({
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
            if(err){
                return next(err)
            }
            if(result.rowCount > 0){
                return res.status(200).json({
                    status : 200,
                    data : result.rows
                })
            }else{
                return res.status(200).json({
                    status : 200,
                    data : "there is no group for you"
                })
            }
        })
    }

    static editName(req, res, next){
        const validate = Validator.schemaCreateGroup(req.body)
        if(validate.error){
            return res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const validateId = Validator.schemaParamsId(req.params);
        if(validateId.error){
            return res.status(422).json({
                status : 422 ,
                error : validateId.error
            })
        }
        const {userId} = req.userData
        const getAGroup = "SELECT * FROM Groups as g INNER JOIN Users as u ON g.userid = u.id AND u.id = $1 AND g.id = $2";
        const values = [userId, req.params.id];
        db(getAGroup, values, (err, result) => {
            if(err)
                return next(err)
            if (result.rowCount == 1){
                const editGroupName = "UPDATE Groups SET name = $1 WHERE id = $2"; 
                const values = [req.body.name, req.params.id];
                db(editGroupName, values, (err, result) => {
                    if(err)
                    return next(err)
                    if(result.rowCount == 1){
                        // result.rows[0].status = "sent"
                        return res.status(200).json({
                            status : 200,
                            message :   ["group name changed correctly"]
                        })
                    }
                })
            }else{
                return res.status(403).json({
                    status : 403,
                    error : "access is denied"
                })
            }
        })
    }

    static delGroup(req, res, next){
        const validateId = Validator.schemaParamsId(req.params);
        if(validateId.error){
            return res.status(422).json({
                status : 422 ,
                error : validateId.error
            })
        }
        const {userId} = req.userData
        const getAGroup = "SELECT * FROM Groups as g INNER JOIN Users as u ON g.userid = u.id AND u.id = $1 AND g.id = $2";
        const values = [userId, req.params.id];
        db(getAGroup, values, (err, result) => {
            if(err)
                return next(err)
            if (result.rowCount == 1){
                const deleteGroupMembers = "DELETE FROM Members WHERE groupid = $1"; 
                const values = [req.params.id];
                db(deleteGroupMembers, values, (err, result) => {
                    if(err)
                    return next(err)
                    if(result.rowCount){
                        const deleteGroup = "DELETE FROM Groups WHERE id = $1";
                        db(deleteGroup, values, (err, result) => {
                            if(err)
                                return next(err)
                            if(result.rowCount > 0){
                                return res.status(200).json({
                                    status : 200,
                                    message :   ["group and its members deleted correctly"]
                                })
                            }
                        })
                    }else{
                        return res.send(result);
                    }
                })
            }else{
                return res.status(403).json({
                    status : 403,
                    error : "access is denied"
                }) 
            }
        })
    }

    static addUser(req, res, next){
        const validateId = Validator.schemaParamsId(req.params);
        if(validateId.error){
            return res.status(422).json({
                status : 422 ,
                error : validateId.error
            })
        }
        const validate = Validator.schemaGroupUser(req.body);
        if(validate.error){
            return res.status(422).json({
                status : 422 ,
                error : validate.error
            })
        }
        const {userId} = req.userData
        const getAGroup = "SELECT * FROM Groups as g INNER JOIN Users as u ON g.userid = u.id AND u.id = $1 AND g.id = $2";
        const values = [userId, req.params.id];
        db(getAGroup, values, (err, result) => {
            if(err)
                return next(err)
            if(result.rowCount == 1){
                const fetchUser = "SELECT * FROM Users WHERE email = $1";
                const values = [req.body.email]
                db(fetchUser, values, (err, result) => {
                    if(err)
                        return next(err)
                    if(result.rowCount == 1){
                        const addGroupMember = "INSERT INTO Members(groupid, userid, role) VALUES($1, $2, $3)";
                        const values = [req.params.id, result.rows[0].id, req.body.role]
                        db(addGroupMember, values, (err, result) => {
                            if(err)
                                return next(err)
                            if(result.rowCount > 0){
                                return res.status(201).json({
                                    status : 201,
                                    message : "user added corectly"
                                })
                            }else{
                                return res.status(500).json({
                                    status : 500,
                                    message : "error while saving"
                                })
                            }
                        })
                    }else{
                        return res.status(404).json({
                            status : 404,
                            error : `${req.body.email} not found, make sure you put a registered user`
                        })
                    }
                })
            }else{
                return res.status(403).json({
                    status : 403,
                    error : "access is denied"
                })
            }
        })
    }

    static delUser(req, res, next){
        return res.status(404).json({
            status : 404,
            error : "not yet done"
        })
    }

    static sendMessage(req, res, next){
        return res.status(404).json({
            status : 404,
            error : "not yet done"
        })
    }
}