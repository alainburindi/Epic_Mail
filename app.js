import express from 'express'
import bodyParser from 'body-parser';
import db from './server/db/db'

const app = express()

import userRoutes from './server/routes/user'
import messageRoutes from './server/routes/messages'
import userRoutes2 from './server/routes/v2/user'
import checkAuth from './server/middleware/v2/check-auth';
import messageRoutes2 from './server/routes/v2/messages'
import groupsRoutes from './server/routes/v2/groups'


const port = process.env.PORT || 3000

const todo = {
    "notice" : "this is the V1 api so make sure to put /api/v1/ before any route. eg: api/v1/auth/login",
     "GET/" : {
        "/" : "the current result",
        "messages" : "all received messages",
        "messages/unread" : "all unread messages",
        "messages/sent" : "all sent messages",
        "messages/:id" : "get a specific message",
    },

    "POST/" : {
        "auth/signup" : "register a new user",
        "auth/login" : "login a registered user",
        "messages" : "send a message",
    },
    "DELETE/" : {
        "messages/:id" : "delete a specific message"
    }
 }
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

const v1 = "/api/v1";
const v2 = "/api/v2";

app.use(`${v1}/auth`, userRoutes)
app.use(`${v1}/messages`, messageRoutes)
app.use(`${v2}/auth`, userRoutes2)
app.use(`${v2}/messages`, checkAuth, messageRoutes2)
app.use(`${v2}/groups`, checkAuth, groupsRoutes)


app.get('/',(req, res, next) => {
    res.status(200).json({
        status : 200,
        message : "welcome to the EpicMail Api, below is how to use it",
        todo
    })
})
app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error : {
            status : error.status,
            message : error.message
        }
    })
})


app.listen(port, () => {
    createTables();
})
function createTables() {
    const createTables = `
    CREATE TABLE IF NOT EXISTS users
    (
        id serial,
        name character varying(255) NOT NULL,
        email character varying(255) NOT NULL,
        password character varying(255) NOT NULL,
        created_at timestamp without time zone DEFAULT now(),
        CONSTRAINT users_pkey PRIMARY KEY (id)
    );
    CREATE TABLE IF NOT EXISTS messages
    (
    id serial,
    subject character varying(255) NOT NULL,
    message character varying(2000) NOT NULL,
    status character varying(10) NOT NULL,
    parentmessageid serial,
    userid serial,
    receiverid serial,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_parentmessageid_fkey FOREIGN KEY (parentmessageid)
        REFERENCES public.messages (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_receiverid_fkey FOREIGN KEY (receiverid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    );

    CREATE TABLE IF NOT EXISTS groups    (
    id serial,
    name character varying(100),
    userid serial,
    CONSTRAINT groups_pkey PRIMARY KEY (id),
    CONSTRAINT group_owner_fk FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS members
    (
    id serial,
    groupid serial,
    userid serial,
    role character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT members_groupid_fkey FOREIGN KEY (groupid)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT members_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    );
    `
    db(createTables, [], (err, result) => {
        if(err)
        console.log(err)
    })
}

module.exports = app;
