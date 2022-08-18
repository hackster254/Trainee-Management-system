const express = require('express')
const router = express.Router()

const slugify = require('slugify')
// const db = require('../config/db')
const {connectDatabase} = require('../config/db')

const {v4: uuidV4} = require('uuid')

/*
 * @param {POST} req
* create a class
*/
router.post('/create', (req,res)=> {

    let connection = connectDatabase()
    const {name} = req.body

    if(!name){
        return res.status(400).json({msg: 'Please fill all fields for class'})
    }

    //sql for course
    let sqlCheck = 'SELECT * FROM classes WHERE slug = ?'
    let sql = 'INSERT INTO classes SET ?'

    const slug = slugify(name).toLowerCase()


    connection.query(sqlCheck,slug, (err,classes)=> {
        if(classes.length> 0){
            return res.status(400).json({msg: 'class already exists'})
        }

        const data = {
            class_name: name.toLowerCase(),
            slug: slugify(name).toLowerCase(),
            uid: uuidV4()
        }
        

        connection.query(sql,data, (err, result)=> {
            if(err){
                return res.status(400).json({msg: 'unable to insert the class data'})
            }

            return res.status(200).json({data})
            
        })
    })

})


router.get('/',(req,res)=>{
    let connection = connectDatabase()
    let getQuery = 'SELECT * FROM classes'

    connection.query(getQuery, (err, result)=> {
        return res.status(200).json(result)
    })
})

router.put('/', (req,res)=>{
    let connection = connectDatabase()

    const {class_name, slug, trainer} = req.body
    const newSlug = slugify(class_name).toLowerCase()

    // if(students.length == 0){
    //     return res.status(400).json({msg : 'please add students to this course. '})
    // }
    let  sqlupdatedata = "UPDATE classes SET class_name=?, slug=?, trainer = ? WHERE slug = ?"

   
    connection.query(sqlupdatedata,
        [
            class_name.toLowerCase(),
            newSlug,
            trainer,
            slug,
        ], 
        function(err) {
            if(err){
                return res.status(500).json({msg: "unable to update class data"})
            }
            res.status(200).json({msg: 'class updated successfully'})
    })
})

/* delete a class */
router.delete('/:uid', (req,res)=>{
    let connection = connectDatabase()
    const {uid} = req.params

    let delQuery = 'DELETE FROM classes WHERE uid = ?'
    connection.query(delQuery,[uid],(err,result)=>{
        if(err){
            res.send(err).status(400)
        } else {
            res.status(200).json({success: "true"})
        }
    })
})

module.exports = router