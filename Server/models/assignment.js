const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);