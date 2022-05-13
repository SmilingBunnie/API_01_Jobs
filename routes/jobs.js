const authMiddleware = require('../middleware/authentication')
const express = require('express')
const router = express.Router()
const { getAllJobs, createJob, updateJob, deleteJob, getSingleJob} = require('../controllers/jobs')

router
    .route('/')
    .get(authMiddleware, getAllJobs)
    .post(authMiddleware, createJob)

router
    .route('/:id')
    .get(authMiddleware, getSingleJob)
    .patch(authMiddleware, updateJob)
    .delete(authMiddleware, deleteJob)

module.exports = router