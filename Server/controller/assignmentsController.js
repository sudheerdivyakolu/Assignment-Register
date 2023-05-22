const Assignment = require('../models/assignment');

const getAssignments = async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'Bad request - User not found' });

    try {
        const assignments = await Assignment.find({ user: userId }).exec();

        const completedAssignments = assignments.filter((assignment) => (assignment.endDate <= new Date() && assignment.deleted === false));
        const incompletedAssignments = assignments.filter((assignment) => (assignment.endDate > new Date() && assignment.deleted === false));
        const deletedAssignments = assignments.filter((assignment) => assignment.deleted === true);

        const completedAssignmentList = completedAssignments.map((assignment) => ({ id: assignment._id, name: assignment.name }));
        const incompletedAssignmentList = incompletedAssignments.map((assignment) => ({ id: assignment._id, name: assignment.name }));
        const deletedAssignmentList = deletedAssignments.map((assignment) => ({ id: assignment._id, name: assignment.name }));

        res.json({ completedAssignmentList, incompletedAssignmentList, deletedAssignmentList });
    } catch (err) {
        next(err);
    }
};

const postAssignment = async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'User not found' });

    const { name, subject, range } = req.body;
    const { startDate, endDate } = range;

    try {
        const query = await Assignment.create({
            name,
            subject,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            user: userId
        });

        res.status(201).json({ 'success': 'Assignment created' });
    } catch (err) {
        next(err);
    }
};

const getAssignment = async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'User not found' });

    const { id } = req.params;

    try {
        const foundAssignment = await Assignment.findById(id).exec();

        if (foundAssignment.user.toString() !== userId) return res.status(400).json({ 'message': 'User not found' });

        res.json(foundAssignment);
    } catch (err) {
        next(err);
    }
};

const putAssignment = async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'User not found' });

    const { id } = req.params;
    const { name, subject, range } = req.body;
    const { startDate, endDate } = range;

    try {
        const foundAssignment = await Assignment.findById(id).exec();

        if (foundAssignment.user.toString() !== userId) return res.status(400).json({ 'message': 'User not found' });

        foundAssignment.name = name;
        foundAssignment.subject = subject;
        foundAssignment.startDate = startDate;
        foundAssignment.endDate = endDate;

        foundAssignment.save();

        res.json({ 'success': 'Assignment updated' });
    } catch (err) {
        next(err);
    }
};

const deleteAssignment = async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'User not found' });

    const { id } = req.params;
    const { permanently } = req.body;
    try {
        const foundAssignment = await Assignment.findById(id).exec();

        if (foundAssignment.user.toString() !== userId) return res.status(400).json({ 'message': 'User not found' });

        if (permanently === true) {
            const query = await Assignment.findByIdAndDelete(id).exec();

            res.json({ 'success': `Assignment ${query.name} is deleted permanently` });
        } else {
            foundAssignment.deleted = true;

            foundAssignment.save();

            res.json({ 'success': `Assignment ${foundAssignment.name} is deleted` });
        }
    } catch (err) {
        next(err);
    }
};

const backupAssignment = async (req, res) => {
    const { userId } = req.session;
    if (!userId) return res.status(400).json({ 'message': 'User not found' });

    const { id } = req.params;
    try {
        const foundAssignment = await Assignment.findById(id).exec();


        if (foundAssignment.user.toString() !== userId) return res.status(400).json({ 'message': 'User not found' });

        if (foundAssignment.deleted === false) return res.status(400).json({ 'message': 'Assignment is not deleted' });

        foundAssignment.deleted = false;

        foundAssignment.save();

        res.json({ 'success': `Assignment ${foundAssignment.name} is backed up`, id: foundAssignment._id, name: foundAssignment.name });
    } catch (err) {
        console.log(err);
        res.status(400).json({ 'message': 'Assignment not found' });
    }
}

module.exports = {
    getAssignments,
    getAssignment,
    postAssignment,
    putAssignment,
    deleteAssignment,
    backupAssignment
}