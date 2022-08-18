const express = require('express')
const router = express.Router()

const slugify = require('slugify')
// const db = require('../config/db')
const {connectDatabase} = require('../config/db')

const {v4: uuidV4} = require('uuid')

/* CREATE A STUDENT

post 

*/
router.post('/create', (req,res)=>{
    let connection = connectDatabase()
    const {name,age, courses, className} =req.body

    if(!name || !age || !courses || !className){
        return res.status(400).json({msg: "Missing all required field"});
    }
    // 
    let sqlCheck = "SELECT * FROM students WHERE slug =?"
    let sql = 'INSERT INTO students SET ?'

    const slug = slugify(name).toLowerCase()

    connection.query(sqlCheck,slug, (err, student)=> {
        if(student.length > 0){
            return res.status(400).json({msg: "Student already exists"});
        }

        const data = {
            student_name: name.toLowerCase(),
            uid: uuidV4(),
            slug: slug,
            student_age: age.toString(),
            student_course: courses.toString().toLowerCase(),
            student_class: className.toLowerCase()

        }

        connection.query(sql, data,(err)=>{
            if(err){
                return res.status(400).json({msg : "error. Unable to insert student data"})
            }

            return res.status(200).json({data})
        })

    })

})
/*
get all students
*/

router.get('/', (req,res)=>{
    let connection = connectDatabase()

    let getQuery = "SELECT * from students"

    connection.query(getQuery,(err,result)=> {
        return res.status(200).json({result})
    })
})

/* update a student
PUT req
*/
router.put('/', (req,res)=>{
    let connection = connectDatabase()

    const {name, age,courses,className,slug, uid} = req.body
    const newSlug = slugify(name).toLowerCase()

    // if(students.length == 0){
    //     return res.status(400).json({msg : 'please add students to this course. '})
    // }
    let  sqlupdatedata = "UPDATE students SET student_name=?,student_class=?,student_age =?,student_course= ?, slug=? WHERE slug = ?"

   
    connection.query(sqlupdatedata,
        [
            name.toLowerCase(),
            className.toLowerCase(),
            age,
            courses.toString(),
            
            newSlug,
            slug
        ], 
        function(err) {
            if(err){
                return res.status(500).json({msg: "unable to update student data ", err})
            }
            res.status(200).json({msg: 'class updated successfully', name,age,courses,className,newSlug, updated: true, uid})
    })
    
})


/* delete a class */
router.delete('/:uid', (req,res)=>{
    let connection = connectDatabase()
    const {uid} = req.params

    let delQuery = 'DELETE FROM students WHERE uid = ?'
    connection.query(delQuery,[uid],(err,result)=>{
        if(err){
            res.status(400).send(err)
        } else {
            res.status(200).json({success: "true"})
        }
    })
})

module.exports = router

