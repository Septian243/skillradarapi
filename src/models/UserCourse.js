const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    user_course_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, ref: 'User' },
    course_id: { type: String, required: true, ref: 'Course' },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'not_started'],
        default: 'in_progress'
    },
    nilai_ujian_akhir: { type: Number, min: 0, max: 100, default: null },
    nilai_submission: { type: Number, min: 1, max: 5, default: null },
    course_score: { type: Number, min: 0, max: 5, default: null },
    progress_percentage: { type: Number, min: 0, max: 100, default: 0 },
    tanggal_mulai: { type: Date, default: null },
    tanggal_selesai: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('UserCourse', userCourseSchema);