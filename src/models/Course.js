const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_id: { type: String, required: true, unique: true },
    course_name: { type: String, required: true, maxlength: 255 },
    has_ujian_akhir: { type: Boolean, default: true },
    has_submission: { type: Boolean, default: false },
    learning_path_id: { type: Number, required: true, ref: 'LearningPath' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);