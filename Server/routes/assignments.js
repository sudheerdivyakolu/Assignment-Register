const express = require('express');
const router = express.Router();
const assignmentsController = require('../controller/assignmentsController');
const validator = require('../middleware/validator');

router.get('/$', assignmentsController.getAssignments);

router.post('/new$', validator.assignmentValidator, assignmentsController.postAssignment);

router.put('/backup/:id$', assignmentsController.backupAssignment);

router.route('/:id$')
    .get(assignmentsController.getAssignment)
    .put(validator.isDeleted, validator.assignmentValidator, assignmentsController.putAssignment)
    .delete(assignmentsController.deleteAssignment);

module.exports = router;