const express = require('express')
const router = express.Router()

const slugify = require('slugify')
// const db = require('../config/db')
const {connectDatabase} = require('../config/db')

const {v4: uuidV4} = require('uuid')

/* GET ALL COURSES

*/
router.get('/',(req,res)=> {
    let connection = connectDatabase()
    let getQuery = 'SELECT * FROM courses'

    connection.query(getQuery, (err, result)=> {
        return res.status(200).json(result)
    })
})

/* CREATE A COURSE

post 

*/
router.post('/create', (req,res)=>{
    let connection = connectDatabase()
    const {name} = req.body

    if(!name){
        return res.status(400).json({msg: 'Please fill all fields'})
    }

    //sql for course
    let sqlCheck = 'SELECT * FROM courses WHERE slug = ?'
    let sql = 'INSERT INTO courses SET ?'

    const slug = slugify(name).toLowerCase()


    connection.query(sqlCheck,slug, (err,course)=> {
        if(course.length> 0){
            return res.status(400).json({msg: 'course already exists'})
        }

        const data = {
            course_name: name.toLowerCase(),
            slug: slugify(name).toLowerCase(),
            uid: uuidV4()
        }
        

        connection.query(sql,data, (err, result)=> {
            if(err){
                return res.status(400).json({msg: 'unable to insert the course data'})
            }

            return res.status(200).json({data})
            
        })
    })
})




/* UPDATE A COURSE 
*/
router.put('/', (req, res)=> {
    let connection = connectDatabase()
    const  {course_name, students, slug} = req.body

    const newSlug = slugify(course_name).toLowerCase()

    // if(students.length == 0){
    //     return res.status(400).json({msg : 'please add students to this course. '})
    // }
    let  sqlupdatedata = "UPDATE courses SET course_name=?, course_students=?, slug=? WHERE slug = ?"

    connection.query(sqlupdatedata,
        [
            course_name.toLowerCase(),
            students.toString().toLowerCase(),
            newSlug,
            slug,
        ], 
        function(err) {
            if(err){
                return res.status(500).json({msg: "unable to update course data"})
            }
            res.status(200).json({msg: 'course updated successfully'})
    })
})

/* delete a course */
router.delete('/', (req,res)=>{
    let connection = connectDatabase()
    const {course_id} = req.body

    let delQuery = 'DELETE FROM courses WHERE course_id = ?'
    connection.query(delQuery,[course_id],(err,result)=>{
        if(err){
            res.send(err).status(400)
        } else {
            res.status(200).json({success: "deleteed true"})
        }
    })
})

module.exports = router