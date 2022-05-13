const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const allJobs = await Job.find({createdBy: req.user.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({allJobs, count: allJobs.length})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.id
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const getSingleJob = async (req, res) => {
    const id = req.params.id
    const job = await Job.findOne({_id: id, createdBy: req.user.id})
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(StatusCodes.OK).json({job})
}

const updateJob = async (req, res) => {
    const { company, position} = req.body
    const id = req.params.id
    /*if (company === '' || position === '') {
        throw new BadRequestError('Company or position fields can not be empty')
    }*/
    const job = await Job.findByIdAndUpdate({_id: id, createdBy: req.user.id}, req.body, {new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req, res) => {
    const id = req.params.id
    const job = await Job.findOneAndDelete({_id: id, createdBy: req.user.id})
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(StatusCodes.OK).send('Deleted')
}

module.exports = {
    getAllJobs,
    createJob,
    getSingleJob,
    updateJob,
    deleteJob,
}