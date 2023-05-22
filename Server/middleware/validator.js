const Assignment = require('../models/assignment');

const assignmentValidator = (req, res, next) => {
    const { name, subject, range } = req.body;
    const { startDate, endDate } = range;

    if (!name || !subject || !startDate || !endDate) return res.status(400).json({ 'message': 'All fields required' });

    const sD = new Date(startDate);
    const eD = new Date(endDate);
    if (sD > eD) return res.status(406).json({ 'message': 'Start date is later than end date' });

    next();
};

const isDeleted = async (req, res, next) => {
    const { id } = req.params;

    try {
        const foundAssignment = await Assignment.findById(id).exec();
        if (!foundAssignment) return res.status(400).json({ 'message': 'Assignment not found' });

        if (foundAssignment.deleted === true) return res.status(400).json({ 'message': 'Assignment is deleted' });

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    assignmentValidator,
    isDeleted
}