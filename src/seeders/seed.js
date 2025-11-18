const mongoose = require('mongoose');
require('dotenv').config();

const LearningPath = require('../models/LearningPath');
const Course = require('../models/Course');
const Skill = require('../models/Skill');
const CourseSkill = require('../models/CourseSkill');
const User = require('../models/User');
const UserCourse = require('../models/UserCourse');
const SkillSnapshot = require('../models/SkillSnapshot');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await LearningPath.deleteMany({});
        await Course.deleteMany({});
        await Skill.deleteMany({});
        await CourseSkill.deleteMany({});
        await User.deleteMany({});
        await UserCourse.deleteMany({});
        await SkillSnapshot.deleteMany({});

        console.log('Cleared existing data');

        const learningPaths = await LearningPath.insertMany([
            { learning_path_id: 1, learning_path_name: 'AI Engineer', description: 'Menjadi AI Engineer profesional' },
            { learning_path_id: 2, learning_path_name: 'Android Developer', description: 'Menjadi Android Developer profesional' },
            { learning_path_id: 3, learning_path_name: 'Back-End Developer JavaScript', description: 'Menjadi Back-End Developer JavaScript' },
            { learning_path_id: 4, learning_path_name: 'Back-End Developer Python', description: 'Menjadi Back-End Developer Python' },
            { learning_path_id: 5, learning_path_name: 'Data Scientist', description: 'Menjadi Data Scientistr' },
            { learning_path_id: 6, learning_path_name: 'DevOps Engineer', description: 'Menjadi DevOps Engineer' },
            { learning_path_id: 7, learning_path_name: 'Front-End Web Developer', description: 'Menjadi Front-End Web Developer' },
            { learning_path_id: 8, learning_path_name: 'Gen AI Engineer', description: 'Menjadi Gen AI Engineer' },
            { learning_path_id: 9, learning_path_name: 'Google Cloud Professional', description: 'Menjadi Google Cloud Professional' },
            { learning_path_id: 10, learning_path_name: 'iOS Developer', description: 'Menjadi iOS Developer' },
            { learning_path_id: 11, learning_path_name: 'MLOps Engineer', description: 'Menjadi MLOps Engineer' },
            { learning_path_id: 12, learning_path_name: 'Multi-Platform App Developer', description: 'Menjadi Multi-Platform Developer' },
            { learning_path_id: 13, learning_path_name: 'React Developer', description: 'Menjadi React Developer' }
        ]);
        console.log('✓ Learning Paths seeded');

        const aiCourses = await Course.insertMany([
            { course_id: "course-1", course_name: "Belajar Dasar AI", has_ujian_akhir: true, has_submission: false, learning_path_id: 1 },
            { course_id: "course-2", course_name: "Belajar Fundamental Deep Learning", has_ujian_akhir: true, has_submission: true, learning_path_id: 1 },
            { course_id: "course-3", course_name: "Belajar Machine Learning untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 1 },
            { course_id: "course-4", course_name: "Machine Learning Terapan", has_ujian_akhir: true, has_submission: true, learning_path_id: 1 },
            { course_id: "course-5", course_name: "Membangun Proyek Deep Learning Tingkat Mahir", has_ujian_akhir: true, has_submission: true, learning_path_id: 1 },
            { course_id: "course-6", course_name: "Memulai Pemrograman dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 1 }
        ]);


        const androidCourses = await Course.insertMany([
            { course_id: "course-7", course_name: "Belajar Fundamental Aplikasi Android", has_ujian_akhir: true, has_submission: true, learning_path_id: 2 },
            { course_id: "course-8", course_name: "Belajar Membuat Aplikasi Android untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 2 },
            { course_id: "course-9", course_name: "Belajar Pengembangan Aplikasi Android Intermediate", has_ujian_akhir: true, has_submission: true, learning_path_id: 2 },
            { course_id: "course-10", course_name: "Belajar Prinsip Pemrograman SOLID", has_ujian_akhir: true, has_submission: false, learning_path_id: 2 },
            { course_id: "course-11", course_name: "Memulai Pemrograman dengan Kotlin", has_ujian_akhir: true, has_submission: true, learning_path_id: 2 },
            { course_id: "course-12", course_name: "Menjadi Android Developer Expert", has_ujian_akhir: true, has_submission: true, learning_path_id: 2 }
        ]);

        const backEndDeveloperJavaScriptCourses = await Course.insertMany([
            { course_id: "course-13", course_name: "Architecting on AWS (Membangun Arsitektur Cloud di AWS)", has_ujian_akhir: true, has_submission: false, learning_path_id: 3 },
            { course_id: "course-14", course_name: "Belajar Back-End Pemula dengan JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 3 },
            { course_id: "course-15", course_name: "Belajar Dasar Cloud dan Gen AI di AWS", has_ujian_akhir: true, has_submission: false, learning_path_id: 3 },
            { course_id: "course-16", course_name: "Belajar Dasar Pemrograman JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 3 },
            { course_id: "course-17", course_name: "Belajar Fundamental Back-End dengan JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 3 },
            { course_id: "course-18", course_name: "Menjadi Back-End Developer Expert dengan JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 3 },
            { course_id: "course-19", course_name: "Menjadi Node.js Application Developer", has_ujian_akhir: true, has_submission: true, learning_path_id: 3 }
        ]);

        const backEndPythonCourses = await Course.insertMany([
            { course_id: "course-20", course_name: "Belajar Back-End Pemula dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 4 },
            { course_id: "course-21", course_name: "Belajar Dasar Google Cloud", has_ujian_akhir: true, has_submission: false, learning_path_id: 4 },
            { course_id: "course-22", course_name: "Belajar Fundamental Back-End dengan Python", has_ujian_akhir: true, has_submission: true, learning_path_id: 4 },
            { course_id: "course-23", course_name: "Memulai Pemrograman dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 4 },
            { course_id: "course-24", course_name: "Menjadi Google Cloud Architect", has_ujian_akhir: true, has_submission: true, learning_path_id: 4 },
            { course_id: "course-25", course_name: "Menjadi Google Cloud Engineer", has_ujian_akhir: true, has_submission: true, learning_path_id: 4 }
        ]);

        const dataScientistCourses = await Course.insertMany([
            { course_id: "course-26", course_name: "Belajar Analisis Data dengan Python", has_ujian_akhir: true, has_submission: true, learning_path_id: 5 },
            { course_id: "course-27", course_name: "Belajar Dasar Data Science", has_ujian_akhir: true, has_submission: false, learning_path_id: 5 },
            { course_id: "course-28", course_name: "Belajar Dasar Structured Query Language (SQL)", has_ujian_akhir: true, has_submission: false, learning_path_id: 5 },
            { course_id: "course-29", course_name: "Belajar Machine Learning untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 5 },
            { course_id: "course-30", course_name: "Belajar Matematika untuk Data Science", has_ujian_akhir: true, has_submission: true, learning_path_id: 5 },
            { course_id: "course-31", course_name: "Belajar Penerapan Data Science", has_ujian_akhir: true, has_submission: true, learning_path_id: 5 },
            { course_id: "course-32", course_name: "Memulai Pemrograman dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 5 }
        ]);

        const devOpsCourses = await Course.insertMany([
            { course_id: "course-33", course_name: "Belajar Dasar-Dasar DevOps", has_ujian_akhir: true, has_submission: false, learning_path_id: 6 },
            { course_id: "course-34", course_name: "Belajar Implementasi CI/CD", has_ujian_akhir: true, has_submission: true, learning_path_id: 6 },
            { course_id: "course-35", course_name: "Belajar Jaringan Komputer untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 6 },
            { course_id: "course-36", course_name: "Belajar Membangun Arsitektur Microservices", has_ujian_akhir: true, has_submission: true, learning_path_id: 6 },
            { course_id: "course-37", course_name: "Menjadi Linux System Administrator", has_ujian_akhir: true, has_submission: true, learning_path_id: 6 }
        ]);

        const frontEndCourses = await Course.insertMany([
            { course_id: "course-38", course_name: "Belajar Dasar Pemrograman JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 7 },
            { course_id: "course-39", course_name: "Belajar Dasar Pemrograman Web", has_ujian_akhir: true, has_submission: true, learning_path_id: 7 },
            { course_id: "course-40", course_name: "Belajar Fundamental Front-End Web Development", has_ujian_akhir: true, has_submission: true, learning_path_id: 7 },
            { course_id: "course-41", course_name: "Belajar Membuat Front-End Web untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 7 },
            { course_id: "course-42", course_name: "Belajar Pengembangan Web Intermediate", has_ujian_akhir: true, has_submission: true, learning_path_id: 7 }
        ]);

        const genAICourses = await Course.insertMany([
            { course_id: "course-43", course_name: "Belajar Dasar AI", has_ujian_akhir: true, has_submission: false, learning_path_id: 8 },
            { course_id: "course-44", course_name: "Belajar Fundamental Deep Learning", has_ujian_akhir: true, has_submission: true, learning_path_id: 8 },
            { course_id: "course-45", course_name: "Belajar Machine Learning untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 8 },
            { course_id: "course-46", course_name: "Memulai Pemrograman dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 8 },
            { course_id: "course-47", course_name: "Prompt Engineering untuk Software Developer", has_ujian_akhir: true, has_submission: false, learning_path_id: 8 }
        ]);

        const googleCloudCourses = await Course.insertMany([
            { course_id: "course-48", course_name: "Belajar Dasar Google Cloud", has_ujian_akhir: true, has_submission: false, learning_path_id: 9 },
            { course_id: "course-49", course_name: "Belajar Dasar Pemrograman JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 9 },
            { course_id: "course-50", course_name: "Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud", has_ujian_akhir: true, has_submission: true, learning_path_id: 9 },
            { course_id: "course-51", course_name: "Menjadi Google Cloud Architect", has_ujian_akhir: true, has_submission: true, learning_path_id: 9 },
            { course_id: "course-52", course_name: "Menjadi Google Cloud Engineer", has_ujian_akhir: true, has_submission: true, learning_path_id: 9 }
        ]);

        const iOSCourses = await Course.insertMany([
            { course_id: "course-53", course_name: "Belajar Fundamental Aplikasi iOS", has_ujian_akhir: true, has_submission: true, learning_path_id: 10 },
            { course_id: "course-54", course_name: "Belajar Membuat Aplikasi iOS untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 10 },
            { course_id: "course-55", course_name: "Belajar Prinsip Pemrograman SOLID", has_ujian_akhir: true, has_submission: false, learning_path_id: 10 },
            { course_id: "course-56", course_name: "Memulai Pemrograman Dengan Swift", has_ujian_akhir: true, has_submission: false, learning_path_id: 10 },
            { course_id: "course-57", course_name: "Menjadi iOS Developer Expert", has_ujian_akhir: true, has_submission: true, learning_path_id: 10 }
        ]);

        const mlOpsCourses = await Course.insertMany([
            { course_id: "course-58", course_name: "Belajar Dasar AI", has_ujian_akhir: true, has_submission: false, learning_path_id: 11 },
            { course_id: "course-59", course_name: "Belajar Fundamental Deep Learning", has_ujian_akhir: true, has_submission: true, learning_path_id: 11 },
            { course_id: "course-60", course_name: "Belajar Machine Learning untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 11 },
            { course_id: "course-61", course_name: "Machine Learning Operations (MLOps)", has_ujian_akhir: true, has_submission: true, learning_path_id: 11 },
            { course_id: "course-62", course_name: "Membangun Sistem Machine Learning", has_ujian_akhir: true, has_submission: true, learning_path_id: 11 },
            { course_id: "course-63", course_name: "Memulai Pemrograman dengan Python", has_ujian_akhir: true, has_submission: false, learning_path_id: 11 }
        ]);

        const multiPlatformCourses = await Course.insertMany([
            { course_id: "course-64", course_name: "Belajar Fundamental Aplikasi Flutter", has_ujian_akhir: true, has_submission: true, learning_path_id: 12 },
            { course_id: "course-65", course_name: "Belajar Membuat Aplikasi Flutter untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 12 },
            { course_id: "course-66", course_name: "Belajar Pengembangan Aplikasi Flutter Intermediate", has_ujian_akhir: true, has_submission: true, learning_path_id: 12 },
            { course_id: "course-67", course_name: "Belajar Prinsip Pemrograman SOLID", has_ujian_akhir: true, has_submission: false, learning_path_id: 12 },
            { course_id: "course-68", course_name: "Memulai Pemrograman dengan Dart", has_ujian_akhir: true, has_submission: false, learning_path_id: 12 },
            { course_id: "course-69", course_name: "Menjadi Flutter Developer Expert", has_ujian_akhir: true, has_submission: true, learning_path_id: 12 }
        ]);

        const reactCourses = await Course.insertMany([
            { course_id: "course-70", course_name: "Belajar Dasar Pemrograman JavaScript", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 },
            { course_id: "course-71", course_name: "Belajar Dasar Pemrograman Web", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 },
            { course_id: "course-72", course_name: "Belajar Fundamental Aplikasi Web dengan React", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 },
            { course_id: "course-73", course_name: "Belajar Membuat Aplikasi Web dengan React", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 },
            { course_id: "course-74", course_name: "Belajar Membuat Front-End Web untuk Pemula", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 },
            { course_id: "course-75", course_name: "Menjadi React Web Developer Expert", has_ujian_akhir: true, has_submission: true, learning_path_id: 13 }
        ]);


        console.log('✓ Courses seeded');

        await Skill.insertMany([
            // ================= AI ENGINEER =================
            { skill_id: "skill-1", skill_name: "Python Programming", learning_path_id: 1, display_order: 1 },
            { skill_id: "skill-2", skill_name: "Machine Learning", learning_path_id: 1, display_order: 2 },
            { skill_id: "skill-3", skill_name: "Deep Learning", learning_path_id: 1, display_order: 3 },
            { skill_id: "skill-4", skill_name: "Computer Vision", learning_path_id: 1, display_order: 4 },
            { skill_id: "skill-5", skill_name: "Natural Language Processing (NLP)", learning_path_id: 1, display_order: 5 },
            { skill_id: "skill-6", skill_name: "Model Deployment & MLOps", learning_path_id: 1, display_order: 6 },

            // ================= ANDROID DEVELOPER =================
            { skill_id: "skill-7", skill_name: "Kotlin Programming", learning_path_id: 2, display_order: 1 },
            { skill_id: "skill-8", skill_name: "Android UI Development", learning_path_id: 2, display_order: 2 },
            { skill_id: "skill-9", skill_name: "Data Persistence", learning_path_id: 2, display_order: 3 },
            { skill_id: "skill-10", skill_name: "Networking & API", learning_path_id: 2, display_order: 4 },
            { skill_id: "skill-11", skill_name: "App Architecture & Testing", learning_path_id: 2, display_order: 5 },
            { skill_id: "skill-12", skill_name: "Performance & Security", learning_path_id: 2, display_order: 6 },

            // ================= BACK-END JS =================
            { skill_id: "skill-13", skill_name: "JavaScript & Node.js", learning_path_id: 3, display_order: 1 },
            { skill_id: "skill-14", skill_name: "RESTful API Development", learning_path_id: 3, display_order: 2 },
            { skill_id: "skill-15", skill_name: "Database Management", learning_path_id: 3, display_order: 3 },
            { skill_id: "skill-16", skill_name: "AWS Cloud Services", learning_path_id: 3, display_order: 4 },
            { skill_id: "skill-17", skill_name: "Testing & CI/CD", learning_path_id: 3, display_order: 5 },
            { skill_id: "skill-18", skill_name: "Security & Scalability", learning_path_id: 3, display_order: 6 },

            // ================= BACK-END PYTHON =================
            { skill_id: "skill-19", skill_name: "Python Programming", learning_path_id: 4, display_order: 1 },
            { skill_id: "skill-20", skill_name: "Django & REST API", learning_path_id: 4, display_order: 2 },
            { skill_id: "skill-21", skill_name: "Database & SQL", learning_path_id: 4, display_order: 3 },
            { skill_id: "skill-22", skill_name: "Google Cloud Platform", learning_path_id: 4, display_order: 4 },
            { skill_id: "skill-23", skill_name: "System Architecture", learning_path_id: 4, display_order: 5 },
            { skill_id: "skill-24", skill_name: "Deployment & Monitoring", learning_path_id: 4, display_order: 6 },

            // ================= DATA SCIENTIST =================
            { skill_id: "skill-25", skill_name: "Python Programming", learning_path_id: 5, display_order: 1 },
            { skill_id: "skill-26", skill_name: "Data Wrangling", learning_path_id: 5, display_order: 2 },
            { skill_id: "skill-27", skill_name: "Data Visualization", learning_path_id: 5, display_order: 3 },
            { skill_id: "skill-28", skill_name: "Statistics & Mathematics", learning_path_id: 5, display_order: 4 },
            { skill_id: "skill-29", skill_name: "Machine Learning", learning_path_id: 5, display_order: 5 },
            { skill_id: "skill-30", skill_name: "Database & SQL", learning_path_id: 5, display_order: 6 },

            // ================= DEVOPS =================
            { skill_id: "skill-31", skill_name: "CI/CD", learning_path_id: 6, display_order: 1 },
            { skill_id: "skill-32", skill_name: "Linux Administration", learning_path_id: 6, display_order: 2 },
            { skill_id: "skill-33", skill_name: "Cloud & Networking", learning_path_id: 6, display_order: 3 },
            { skill_id: "skill-34", skill_name: "Containerization", learning_path_id: 6, display_order: 4 },
            { skill_id: "skill-35", skill_name: "Microservices", learning_path_id: 6, display_order: 5 },
            { skill_id: "skill-36", skill_name: "DevOps Culture", learning_path_id: 6, display_order: 6 },

            // ================= FRONT-END =================
            { skill_id: "skill-37", skill_name: "HTML & CSS", learning_path_id: 7, display_order: 1 },
            { skill_id: "skill-38", skill_name: "JavaScript Programming", learning_path_id: 7, display_order: 2 },
            { skill_id: "skill-39", skill_name: "DOM & Events", learning_path_id: 7, display_order: 3 },
            { skill_id: "skill-40", skill_name: "Build Tools & Bundler", learning_path_id: 7, display_order: 4 },
            { skill_id: "skill-41", skill_name: "Web Performance", learning_path_id: 7, display_order: 5 },
            { skill_id: "skill-42", skill_name: "Code Quality & Deploy", learning_path_id: 7, display_order: 6 },

            // ================= GEN AI ENGINEER =================
            { skill_id: "skill-43", skill_name: "Python Programming", learning_path_id: 8, display_order: 1 },
            { skill_id: "skill-44", skill_name: "Machine Learning", learning_path_id: 8, display_order: 2 },
            { skill_id: "skill-45", skill_name: "Deep Learning", learning_path_id: 8, display_order: 3 },
            { skill_id: "skill-46", skill_name: "Generative AI", learning_path_id: 8, display_order: 4 },
            { skill_id: "skill-47", skill_name: "Prompt Engineering", learning_path_id: 8, display_order: 5 },
            { skill_id: "skill-48", skill_name: "AI Ethics & Deployment", learning_path_id: 8, display_order: 6 },

            // ================= GOOGLE CLOUD =================
            { skill_id: "skill-49", skill_name: "GCP Infrastructure", learning_path_id: 9, display_order: 1 },
            { skill_id: "skill-50", skill_name: "GCP Networking & Security", learning_path_id: 9, display_order: 2 },
            { skill_id: "skill-51", skill_name: "GCP Storage & Database", learning_path_id: 9, display_order: 3 },
            { skill_id: "skill-52", skill_name: "Cloud App Development", learning_path_id: 9, display_order: 4 },
            { skill_id: "skill-53", skill_name: "Cloud Monitoring", learning_path_id: 9, display_order: 5 },
            { skill_id: "skill-54", skill_name: "Cloud Architecture", learning_path_id: 9, display_order: 6 },

            // ================= iOS DEVELOPER =================
            { skill_id: "skill-55", skill_name: "Swift Programming", learning_path_id: 10, display_order: 1 },
            { skill_id: "skill-56", skill_name: "iOS UI Development", learning_path_id: 10, display_order: 2 },
            { skill_id: "skill-57", skill_name: "iOS App Development", learning_path_id: 10, display_order: 3 },
            { skill_id: "skill-58", skill_name: "Data & Networking", learning_path_id: 10, display_order: 4 },
            { skill_id: "skill-59", skill_name: "iOS Architecture & Testing", learning_path_id: 10, display_order: 5 },
            { skill_id: "skill-60", skill_name: "Reactive & CI/CD", learning_path_id: 10, display_order: 6 },

            // ================= MLOPS =================
            { skill_id: "skill-61", skill_name: "Python Programming", learning_path_id: 11, display_order: 1 },
            { skill_id: "skill-62", skill_name: "Machine Learning", learning_path_id: 11, display_order: 2 },
            { skill_id: "skill-63", skill_name: "Deep Learning & AI", learning_path_id: 11, display_order: 3 },
            { skill_id: "skill-64", skill_name: "MLOps & Deployment", learning_path_id: 11, display_order: 4 },
            { skill_id: "skill-65", skill_name: "Data Pipeline & Monitoring", learning_path_id: 11, display_order: 5 },
            { skill_id: "skill-66", skill_name: "Model Optimization", learning_path_id: 11, display_order: 6 },

            // ================= MULTI-PLATFORM / FLUTTER =================
            { skill_id: "skill-67", skill_name: "Dart Programming", learning_path_id: 12, display_order: 1 },
            { skill_id: "skill-68", skill_name: "Flutter Fundamentals", learning_path_id: 12, display_order: 2 },
            { skill_id: "skill-69", skill_name: "State Management", learning_path_id: 12, display_order: 3 },
            { skill_id: "skill-70", skill_name: "Flutter UI & Animation", learning_path_id: 12, display_order: 4 },
            { skill_id: "skill-71", skill_name: "Architecture & Testing", learning_path_id: 12, display_order: 5 },
            { skill_id: "skill-72", skill_name: "Deployment & CI/CD", learning_path_id: 12, display_order: 6 },

            // ================= REACT DEVELOPER =================
            { skill_id: "skill-73", skill_name: "JavaScript ES6+", learning_path_id: 13, display_order: 1 },
            { skill_id: "skill-74", skill_name: "HTML & CSS", learning_path_id: 13, display_order: 2 },
            { skill_id: "skill-75", skill_name: "React Fundamentals", learning_path_id: 13, display_order: 3 },
            { skill_id: "skill-76", skill_name: "State Management", learning_path_id: 13, display_order: 4 },
            { skill_id: "skill-77", skill_name: "Styling & Components", learning_path_id: 13, display_order: 5 },
            { skill_id: "skill-78", skill_name: "Testing & Deployment", learning_path_id: 13, display_order: 6 }
        ]);

        console.log('✓ Skills seeded');

        await CourseSkill.insertMany([
            { course_skill_id: "cs-1", course_id: "course-3", skill_id: "skill-1", bobot: 30 },
            { course_skill_id: "cs-2", course_id: "course-6", skill_id: "skill-1", bobot: 70 },

            { course_skill_id: "cs-3", course_id: "course-2", skill_id: "skill-4", bobot: 40 },
            { course_skill_id: "cs-4", course_id: "course-4", skill_id: "skill-4", bobot: 30 },
            { course_skill_id: "cs-5", course_id: "course-5", skill_id: "skill-4", bobot: 30 },

            { course_skill_id: "cs-6", course_id: "course-1", skill_id: "skill-2", bobot: 15 },
            { course_skill_id: "cs-7", course_id: "course-3", skill_id: "skill-2", bobot: 45 },
            { course_skill_id: "cs-8", course_id: "course-4", skill_id: "skill-2", bobot: 40 },

            { course_skill_id: "cs-9", course_id: "course-2", skill_id: "skill-3", bobot: 50 },
            { course_skill_id: "cs-10", course_id: "course-4", skill_id: "skill-3", bobot: 25 },
            { course_skill_id: "cs-11", course_id: "course-5", skill_id: "skill-3", bobot: 25 },

            { course_skill_id: "cs-12", course_id: "course-2", skill_id: "skill-5", bobot: 35 },
            { course_skill_id: "cs-13", course_id: "course-4", skill_id: "skill-5", bobot: 30 },
            { course_skill_id: "cs-14", course_id: "course-5", skill_id: "skill-5", bobot: 35 },

            { course_skill_id: "cs-15", course_id: "course-4", skill_id: "skill-6", bobot: 50 },
            { course_skill_id: "cs-16", course_id: "course-5", skill_id: "skill-6", bobot: 50 },

            { course_skill_id: "cs-17", course_id: "course-9", skill_id: "skill-7", bobot: 10 },
            { course_skill_id: "cs-18", course_id: "course-11", skill_id: "skill-7", bobot: 80 },
            { course_skill_id: "cs-19", course_id: "course-12", skill_id: "skill-7", bobot: 10 },

            { course_skill_id: "cs-20", course_id: "course-7", skill_id: "skill-8", bobot: 40 },
            { course_skill_id: "cs-21", course_id: "course-8", skill_id: "skill-8", bobot: 60 },

            { course_skill_id: "cs-22", course_id: "course-7", skill_id: "skill-9", bobot: 50 },
            { course_skill_id: "cs-23", course_id: "course-9", skill_id: "skill-9", bobot: 50 },

            { course_skill_id: "cs-24", course_id: "course-7", skill_id: "skill-10", bobot: 40 },
            { course_skill_id: "cs-25", course_id: "course-9", skill_id: "skill-10", bobot: 30 },
            { course_skill_id: "cs-26", course_id: "course-12", skill_id: "skill-10", bobot: 30 },

            { course_skill_id: "cs-27", course_id: "course-9", skill_id: "skill-11", bobot: 40 },
            { course_skill_id: "cs-28", course_id: "course-12", skill_id: "skill-11", bobot: 60 },

            { course_skill_id: "cs-29", course_id: "course-12", skill_id: "skill-12", bobot: 100 },

            { course_skill_id: "cs-30", course_id: "course-14", skill_id: "skill-13", bobot: 35 },
            { course_skill_id: "cs-31", course_id: "course-16", skill_id: "skill-13", bobot: 40 },
            { course_skill_id: "cs-32", course_id: "course-19", skill_id: "skill-13", bobot: 25 },

            { course_skill_id: "cs-33", course_id: "course-14", skill_id: "skill-14", bobot: 25 },
            { course_skill_id: "cs-34", course_id: "course-17", skill_id: "skill-14", bobot: 35 },
            { course_skill_id: "cs-35", course_id: "course-18", skill_id: "skill-14", bobot: 20 },
            { course_skill_id: "cs-36", course_id: "course-19", skill_id: "skill-14", bobot: 20 },

            { course_skill_id: "cs-37", course_id: "course-13", skill_id: "skill-15", bobot: 40 },
            { course_skill_id: "cs-38", course_id: "course-17", skill_id: "skill-15", bobot: 60 },

            { course_skill_id: "cs-39", course_id: "course-13", skill_id: "skill-16", bobot: 35 },
            { course_skill_id: "cs-40", course_id: "course-15", skill_id: "skill-16", bobot: 30 },
            { course_skill_id: "cs-41", course_id: "course-17", skill_id: "skill-16", bobot: 15 },
            { course_skill_id: "cs-42", course_id: "course-18", skill_id: "skill-16", bobot: 20 },

            { course_skill_id: "cs-43", course_id: "course-18", skill_id: "skill-17", bobot: 50 },
            { course_skill_id: "cs-44", course_id: "course-19", skill_id: "skill-17", bobot: 50 },

            { course_skill_id: "cs-45", course_id: "course-13", skill_id: "skill-18", bobot: 30 },
            { course_skill_id: "cs-46", course_id: "course-17", skill_id: "skill-18", bobot: 30 },
            { course_skill_id: "cs-47", course_id: "course-18", skill_id: "skill-18", bobot: 40 },

            { course_skill_id: "cs-48", course_id: "course-20", skill_id: "skill-19", bobot: 30 },
            { course_skill_id: "cs-49", course_id: "course-23", skill_id: "skill-19", bobot: 70 },

            { course_skill_id: "cs-50", course_id: "course-20", skill_id: "skill-20", bobot: 30 },
            { course_skill_id: "cs-51", course_id: "course-22", skill_id: "skill-20", bobot: 70 },

            { course_skill_id: "cs-52", course_id: "course-22", skill_id: "skill-21", bobot: 60 },
            { course_skill_id: "cs-53", course_id: "course-25", skill_id: "skill-21", bobot: 40 },

            { course_skill_id: "cs-54", course_id: "course-21", skill_id: "skill-22", bobot: 20 },
            { course_skill_id: "cs-55", course_id: "course-24", skill_id: "skill-22", bobot: 40 },
            { course_skill_id: "cs-56", course_id: "course-25", skill_id: "skill-22", bobot: 40 },

            { course_skill_id: "cs-57", course_id: "course-22", skill_id: "skill-23", bobot: 20 },
            { course_skill_id: "cs-58", course_id: "course-24", skill_id: "skill-23", bobot: 50 },
            { course_skill_id: "cs-59", course_id: "course-25", skill_id: "skill-23", bobot: 30 },

            { course_skill_id: "cs-60", course_id: "course-22", skill_id: "skill-24", bobot: 40 },
            { course_skill_id: "cs-61", course_id: "course-24", skill_id: "skill-24", bobot: 20 },
            { course_skill_id: "cs-62", course_id: "course-25", skill_id: "skill-24", bobot: 40 },

            { course_skill_id: "cs-63", course_id: "course-26", skill_id: "skill-25", bobot: 25 },
            { course_skill_id: "cs-64", course_id: "course-31", skill_id: "skill-25", bobot: 15 },
            { course_skill_id: "cs-65", course_id: "course-32", skill_id: "skill-25", bobot: 60 },

            { course_skill_id: "cs-66", course_id: "course-26", skill_id: "skill-26", bobot: 40 },
            { course_skill_id: "cs-67", course_id: "course-27", skill_id: "skill-26", bobot: 20 },
            { course_skill_id: "cs-68", course_id: "course-31", skill_id: "skill-26", bobot: 40 },

            { course_skill_id: "cs-69", course_id: "course-26", skill_id: "skill-27", bobot: 40 },
            { course_skill_id: "cs-70", course_id: "course-27", skill_id: "skill-27", bobot: 20 },
            { course_skill_id: "cs-71", course_id: "course-31", skill_id: "skill-27", bobot: 40 },

            { course_skill_id: "cs-72", course_id: "course-27", skill_id: "skill-28", bobot: 25 },
            { course_skill_id: "cs-73", course_id: "course-29", skill_id: "skill-28", bobot: 15 },
            { course_skill_id: "cs-74", course_id: "course-30", skill_id: "skill-28", bobot: 60 },

            { course_skill_id: "cs-75", course_id: "course-27", skill_id: "skill-29", bobot: 20 },
            { course_skill_id: "cs-76", course_id: "course-29", skill_id: "skill-29", bobot: 60 },
            { course_skill_id: "cs-77", course_id: "course-31", skill_id: "skill-29", bobot: 20 },

            { course_skill_id: "cs-78", course_id: "course-28", skill_id: "skill-30", bobot: 100 },

            { course_skill_id: "cs-79", course_id: "course-34", skill_id: "skill-31", bobot: 100 },
            { course_skill_id: "cs-80", course_id: "course-37", skill_id: "skill-32", bobot: 100 },
            { course_skill_id: "cs-81", course_id: "course-35", skill_id: "skill-33", bobot: 100 },

            { course_skill_id: "cs-82", course_id: "course-36", skill_id: "skill-34", bobot: 60 },
            { course_skill_id: "cs-83", course_id: "course-37", skill_id: "skill-34", bobot: 40 },

            { course_skill_id: "cs-84", course_id: "course-36", skill_id: "skill-35", bobot: 100 },

            { course_skill_id: "cs-85", course_id: "course-33", skill_id: "skill-36", bobot: 100 },

            { course_skill_id: "cs-86", course_id: "course-39", skill_id: "skill-37", bobot: 80 },
            { course_skill_id: "cs-87", course_id: "course-40", skill_id: "skill-37", bobot: 20 },

            { course_skill_id: "cs-88", course_id: "course-38", skill_id: "skill-38", bobot: 70 },
            { course_skill_id: "cs-89", course_id: "course-40", skill_id: "skill-38", bobot: 30 },

            { course_skill_id: "cs-90", course_id: "course-41", skill_id: "skill-39", bobot: 100 },

            { course_skill_id: "cs-91", course_id: "course-40", skill_id: "skill-40", bobot: 60 },
            { course_skill_id: "cs-92", course_id: "course-42", skill_id: "skill-40", bobot: 40 },

            { course_skill_id: "cs-93", course_id: "course-42", skill_id: "skill-41", bobot: 100 },

            { course_skill_id: "cs-94", course_id: "course-42", skill_id: "skill-42", bobot: 100 },

            { course_skill_id: "cs-95", course_id: "course-46", skill_id: "skill-43", bobot: 100 },

            { course_skill_id: "cs-96", course_id: "course-43", skill_id: "skill-44", bobot: 30 },
            { course_skill_id: "cs-97", course_id: "course-45", skill_id: "skill-44", bobot: 70 },

            { course_skill_id: "cs-98", course_id: "course-44", skill_id: "skill-45", bobot: 100 },

            { course_skill_id: "cs-99", course_id: "course-43", skill_id: "skill-46", bobot: 20 },
            { course_skill_id: "cs-100", course_id: "course-44", skill_id: "skill-46", bobot: 80 },

            { course_skill_id: "cs-101", course_id: "course-47", skill_id: "skill-47", bobot: 100 },

            { course_skill_id: "cs-102", course_id: "course-43", skill_id: "skill-48", bobot: 50 },
            { course_skill_id: "cs-103", course_id: "course-44", skill_id: "skill-48", bobot: 30 },
            { course_skill_id: "cs-104", course_id: "course-47", skill_id: "skill-48", bobot: 20 },

            { course_skill_id: "cs-105", course_id: "course-48", skill_id: "skill-49", bobot: 25 },
            { course_skill_id: "cs-106", course_id: "course-51", skill_id: "skill-49", bobot: 40 },
            { course_skill_id: "cs-107", course_id: "course-52", skill_id: "skill-49", bobot: 35 },

            { course_skill_id: "cs-108", course_id: "course-48", skill_id: "skill-50", bobot: 25 },
            { course_skill_id: "cs-109", course_id: "course-51", skill_id: "skill-50", bobot: 40 },
            { course_skill_id: "cs-110", course_id: "course-52", skill_id: "skill-50", bobot: 35 },

            { course_skill_id: "cs-111", course_id: "course-48", skill_id: "skill-51", bobot: 30 },
            { course_skill_id: "cs-112", course_id: "course-51", skill_id: "skill-51", bobot: 20 },
            { course_skill_id: "cs-113", course_id: "course-52", skill_id: "skill-51", bobot: 50 },

            { course_skill_id: "cs-114", course_id: "course-49", skill_id: "skill-52", bobot: 25 },
            { course_skill_id: "cs-115", course_id: "course-50", skill_id: "skill-52", bobot: 50 },
            { course_skill_id: "cs-116", course_id: "course-52", skill_id: "skill-52", bobot: 25 },

            { course_skill_id: "cs-117", course_id: "course-48", skill_id: "skill-53", bobot: 20 },
            { course_skill_id: "cs-118", course_id: "course-52", skill_id: "skill-53", bobot: 80 },

            { course_skill_id: "cs-119", course_id: "course-51", skill_id: "skill-54", bobot: 60 },
            { course_skill_id: "cs-120", course_id: "course-52", skill_id: "skill-54", bobot: 40 },

            { course_skill_id: "cs-121", course_id: "course-55", skill_id: "skill-55", bobot: 40 },
            { course_skill_id: "cs-122", course_id: "course-56", skill_id: "skill-55", bobot: 60 },

            { course_skill_id: "cs-123", course_id: "course-53", skill_id: "skill-56", bobot: 40 },
            { course_skill_id: "cs-124", course_id: "course-54", skill_id: "skill-56", bobot: 60 },

            { course_skill_id: "cs-125", course_id: "course-53", skill_id: "skill-57", bobot: 50 },
            { course_skill_id: "cs-126", course_id: "course-54", skill_id: "skill-57", bobot: 50 },

            { course_skill_id: "cs-127", course_id: "course-53", skill_id: "skill-58", bobot: 100 },

            { course_skill_id: "cs-128", course_id: "course-55", skill_id: "skill-59", bobot: 40 },
            { course_skill_id: "cs-129", course_id: "course-57", skill_id: "skill-59", bobot: 60 },

            { course_skill_id: "cs-130", course_id: "course-57", skill_id: "skill-60", bobot: 100 },

            { course_skill_id: "cs-131", course_id: "course-61", skill_id: "skill-61", bobot: 40 },
            { course_skill_id: "cs-132", course_id: "course-63", skill_id: "skill-61", bobot: 60 },

            { course_skill_id: "cs-133", course_id: "course-58", skill_id: "skill-62", bobot: 40 },
            { course_skill_id: "cs-134", course_id: "course-60", skill_id: "skill-62", bobot: 60 },

            { course_skill_id: "cs-135", course_id: "course-58", skill_id: "skill-63", bobot: 40 },
            { course_skill_id: "cs-136", course_id: "course-59", skill_id: "skill-63", bobot: 60 },

            { course_skill_id: "cs-137", course_id: "course-61", skill_id: "skill-64", bobot: 60 },
            { course_skill_id: "cs-138", course_id: "course-62", skill_id: "skill-64", bobot: 40 },

            { course_skill_id: "cs-139", course_id: "course-61", skill_id: "skill-65", bobot: 50 },
            { course_skill_id: "cs-140", course_id: "course-62", skill_id: "skill-65", bobot: 50 },

            { course_skill_id: "cs-141", course_id: "course-60", skill_id: "skill-66", bobot: 40 },
            { course_skill_id: "cs-142", course_id: "course-62", skill_id: "skill-66", bobot: 60 },

            { course_skill_id: "cs-143", course_id: "course-67", skill_id: "skill-67", bobot: 40 },
            { course_skill_id: "cs-144", course_id: "course-68", skill_id: "skill-67", bobot: 60 },

            { course_skill_id: "cs-145", course_id: "course-64", skill_id: "skill-68", bobot: 40 },
            { course_skill_id: "cs-146", course_id: "course-65", skill_id: "skill-68", bobot: 60 },

            { course_skill_id: "cs-147", course_id: "course-64", skill_id: "skill-69", bobot: 20 },
            { course_skill_id: "cs-148", course_id: "course-66", skill_id: "skill-69", bobot: 40 },
            { course_skill_id: "cs-149", course_id: "course-69", skill_id: "skill-69", bobot: 40 },

            { course_skill_id: "cs-150", course_id: "course-64", skill_id: "skill-70", bobot: 30 },
            { course_skill_id: "cs-151", course_id: "course-65", skill_id: "skill-70", bobot: 20 },
            { course_skill_id: "cs-152", course_id: "course-66", skill_id: "skill-70", bobot: 50 },

            { course_skill_id: "cs-153", course_id: "course-67", skill_id: "skill-71", bobot: 30 },
            { course_skill_id: "cs-154", course_id: "course-69", skill_id: "skill-71", bobot: 70 },

            { course_skill_id: "cs-155", course_id: "course-66", skill_id: "skill-72", bobot: 30 },
            { course_skill_id: "cs-156", course_id: "course-69", skill_id: "skill-72", bobot: 70 },

            { course_skill_id: "cs-157", course_id: "course-70", skill_id: "skill-73", bobot: 60 },
            { course_skill_id: "cs-158", course_id: "course-74", skill_id: "skill-73", bobot: 40 },

            { course_skill_id: "cs-159", course_id: "course-71", skill_id: "skill-74", bobot: 60 },
            { course_skill_id: "cs-160", course_id: "course-74", skill_id: "skill-74", bobot: 40 },

            { course_skill_id: "cs-161", course_id: "course-72", skill_id: "skill-75", bobot: 60 },
            { course_skill_id: "cs-162", course_id: "course-73", skill_id: "skill-75", bobot: 40 },

            { course_skill_id: "cs-163", course_id: "course-72", skill_id: "skill-76", bobot: 40 },
            { course_skill_id: "cs-164", course_id: "course-75", skill_id: "skill-76", bobot: 60 },

            { course_skill_id: "cs-165", course_id: "course-73", skill_id: "skill-77", bobot: 40 },
            { course_skill_id: "cs-166", course_id: "course-75", skill_id: "skill-77", bobot: 60 },

            { course_skill_id: "cs-167", course_id: "course-75", skill_id: "skill-78", bobot: 100 }
        ]);


        console.log('✓ Course Skills seeded');

        const users = await User.insertMany([
            {
                user_id: "user-1",
                user_name: "Septian Gilang",
                email: "septian@example.com",
                active_learning_path_id: 1
            },
            {
                user_id: "user-2",
                user_name: "Aulia Rahman",
                email: "aulia.rahman@example.com",
                active_learning_path_id: 2
            },
        ]);


        console.log('✓ Users seeded');

        await UserCourse.insertMany([
            {
                user_course_id: "uc-1",
                user_id: "user-1",
                course_id: "course-1",
                status: "completed",
                nilai_ujian_akhir: 82,
                nilai_submission: null,
                course_score: 1.23,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-05"),
                tanggal_selesai: new Date("2025-01-12")
            },
            {
                user_course_id: "uc-2",
                user_id: "user-1",
                course_id: "course-2",
                status: "completed",
                nilai_ujian_akhir: 90,
                nilai_submission: 5,
                course_score: 4.85,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-13"),
                tanggal_selesai: new Date("2025-01-22")
            },
            {
                user_course_id: "uc-3",
                user_id: "user-1",
                course_id: "course-3",
                status: "completed",
                nilai_ujian_akhir: 88,
                nilai_submission: 4,
                course_score: 4.55,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-23"),
                tanggal_selesai: new Date("2025-02-02")
            },
            {
                user_course_id: "uc-4",
                user_id: "user-1",
                course_id: "course-4",
                status: "in_progress",
                nilai_ujian_akhir: 85,
                nilai_submission: 4,
                course_score: null,
                progress_percentage: 45,
                tanggal_mulai: new Date("2025-02-03"),
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-5",
                user_id: "user-1",
                course_id: "course-5",
                status: "not_started",
                nilai_ujian_akhir: 87,
                nilai_submission: 3,
                course_score: null,
                progress_percentage: 0,
                tanggal_mulai: null,
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-6",
                user_id: "user-1",
                course_id: "course-6",
                status: "not_started",
                nilai_ujian_akhir: 80,
                nilai_submission: null,
                course_score: null,
                progress_percentage: 0,
                tanggal_mulai: null,
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-7",
                user_id: "user-1",
                course_id: "course-7",
                status: "completed",
                nilai_ujian_akhir: 92,
                nilai_submission: 5,
                course_score: 4.90,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-05"),
                tanggal_selesai: new Date("2025-02-14")
            },
            {
                user_course_id: "uc-8",
                user_id: "user-1",
                course_id: "course-8",
                status: "completed",
                nilai_ujian_akhir: 94,
                nilai_submission: 5,
                course_score: 4.96,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-15"),
                tanggal_selesai: new Date("2025-02-24")
            },
            {
                user_course_id: "uc-9",
                user_id: "user-1",
                course_id: "course-9",
                status: "completed",
                nilai_ujian_akhir: 89,
                nilai_submission: 5,
                course_score: 4.82,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-25"),
                tanggal_selesai: new Date("2025-03-05")
            },
            {
                user_course_id: "uc-10",
                user_id: "user-1",
                course_id: "course-10",
                status: "completed",
                nilai_ujian_akhir: 85,
                nilai_submission: null,
                course_score: 1.27,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-03-06"),
                tanggal_selesai: new Date("2025-03-12")
            },
            {
                user_course_id: "uc-11",
                user_id: "user-1",
                course_id: "course-11",
                status: "completed",
                nilai_ujian_akhir: 96,
                nilai_submission: 5,
                course_score: 4.98,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-03-13"),
                tanggal_selesai: new Date("2025-03-22")
            },
            {
                user_course_id: "uc-12",
                user_id: "user-1",
                course_id: "course-12",
                status: "completed",
                nilai_ujian_akhir: 91,
                nilai_submission: 5,
                course_score: 4.88,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-03-23"),
                tanggal_selesai: new Date("2025-04-01")
            },

            {
                user_course_id: "uc-13",
                user_id: "user-2",
                course_id: "course-1",
                status: "completed",
                nilai_ujian_akhir: 83,
                nilai_submission: null,
                course_score: 1.24,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-05"),
                tanggal_selesai: new Date("2025-01-15")
            },
            {
                user_course_id: "uc-14",
                user_id: "user-2",
                course_id: "course-2",
                status: "completed",
                nilai_ujian_akhir: 88,
                nilai_submission: 4,
                course_score: 4.62,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-16"),
                tanggal_selesai: new Date("2025-01-26")
            },
            {
                user_course_id: "uc-15",
                user_id: "user-2",
                course_id: "course-3",
                status: "completed",
                nilai_ujian_akhir: 90,
                nilai_submission: 5,
                course_score: 4.85,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-01-27"),
                tanggal_selesai: new Date("2025-02-05")
            },
            {
                user_course_id: "uc-16",
                user_id: "user-2",
                course_id: "course-4",
                status: "completed",
                nilai_ujian_akhir: 87,
                nilai_submission: 4,
                course_score: 1.31,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-06"),
                tanggal_selesai: new Date("2025-02-15")
            },
            {
                user_course_id: "uc-17",
                user_id: "user-2",
                course_id: "course-5",
                status: "completed",
                nilai_ujian_akhir: 92,
                nilai_submission: 5,
                course_score: 4.90,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-16"),
                tanggal_selesai: new Date("2025-02-26")
            },
            {
                user_course_id: "uc-18",
                user_id: "user-2",
                course_id: "course-6",
                status: "completed",
                nilai_ujian_akhir: 89,
                nilai_submission: null,
                course_score: 1.34,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-02-27"),
                tanggal_selesai: new Date("2025-03-07")
            },
            {
                user_course_id: "uc-19",
                user_id: "user-2",
                course_id: "course-7",
                status: "completed",
                nilai_ujian_akhir: 90,
                nilai_submission: 5,
                course_score: 4.85,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-03-08"),
                tanggal_selesai: new Date("2025-03-16")
            },
            {
                user_course_id: "uc-20",
                user_id: "user-2",
                course_id: "course-8",
                status: "completed",
                nilai_ujian_akhir: 87,
                nilai_submission: 4,
                course_score: 4.52,
                progress_percentage: 100,
                tanggal_mulai: new Date("2025-03-17"),
                tanggal_selesai: new Date("2025-03-24")
            },
            {
                user_course_id: "uc-21",
                user_id: "user-2",
                course_id: "course-9",
                status: "in_progress",
                nilai_ujian_akhir: 85,
                nilai_submission: 5,
                course_score: null,
                progress_percentage: 50,
                tanggal_mulai: new Date("2025-03-25"),
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-22",
                user_id: "user-2",
                course_id: "course-10",
                status: "in_progress",
                nilai_ujian_akhir: 90,
                nilai_submission: null,
                course_score: null,
                progress_percentage: 30,
                tanggal_mulai: new Date("2025-03-26"),
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-23",
                user_id: "user-2",
                course_id: "course-11",
                status: "not_started",
                nilai_ujian_akhir: 80,
                nilai_submission: 3,
                course_score: null,
                progress_percentage: 0,
                tanggal_mulai: null,
                tanggal_selesai: null
            },
            {
                user_course_id: "uc-24",
                user_id: "user-2",
                course_id: "course-12",
                status: "not_started",
                nilai_ujian_akhir: 86,
                nilai_submission: 3,
                course_score: null,
                progress_percentage: 0,
                tanggal_mulai: null,
                tanggal_selesai: null
            }

        ]);

        console.log('✓ User Courses seeded');

        await SkillSnapshot.insertMany([
            {
                snapshot_id: 1,
                user_id: "user-1",
                learning_path_id: 1,
                snapshot_date: new Date("2025-11-15"),

                skill_data: {
                    "Python Programming": 4.0,
                    "Machine Learning": 3.2,
                    "Deep Learning": 2.8,
                    "Computer Vision": 1.5,
                    "NLP": 1.7,
                    "Model Deployment & MLOps": 1.0
                },

                strongest_skill: "Python Programming",
                weakest_skill: "Model Deployment & MLOps",
                average_score: 2.36
            },

            {
                snapshot_id: 2,
                user_id: "user-1",
                learning_path_id: 1,
                snapshot_date: new Date("2025-11-10"),

                skill_data: {
                    "Python Programming": 4.0,
                    "Machine Learning": 3.2,
                    "Deep Learning": 0,
                    "Computer Vision": 1.5,
                    "NLP": 0,
                    "Model Deployment & MLOps": 1.0
                },

                strongest_skill: "Python Programming",
                weakest_skill: "Model Deployment & MLOps",
                average_score: 2.36
            },
            {
                snapshot_id: 3,
                user_id: "user-1",
                learning_path_id: 2,
                snapshot_date: new Date("2025-11-10"),

                skill_data: {
                    "Kotlin Programming": 4.7,
                    "UI/UX Design": 4.3,
                    "Data Management": 3,
                    "Networking & API": 4.4,
                    "Architecture & Testing": 4.5,
                    "Performance & Security": 3
                },

                strongest_skill: "Kotlin Programming",
                weakest_skill: "UI/UX Design",
                average_score: 4.45
            },

            {
                snapshot_id: 4,
                user_id: "user-1",
                learning_path_id: 2,
                snapshot_date: new Date("2025-11-05"),

                skill_data: {
                    "Kotlin Programming": 4.0,
                    "UI/UX Design": 4.0,
                    "Data Management": 4.0,
                    "Networking & API": 4.0,
                    "Architecture & Testing": 4.0,
                    "Performance & Security": 4.0
                },

                strongest_skill: "Kotlin Programming",
                weakest_skill: "UI/UX Design",
                average_score: 4.45
            },

            {
                snapshot_id: 5,
                user_id: "user-2",
                learning_path_id: 1,
                snapshot_date: new Date("2025-03-10"),

                skill_data: {
                    "Python Programming": 4.6,
                    "Machine Learning": 3,
                    "Deep Learning": 4.3,
                    "Computer Vision": 2,
                    "NLP": 4.1,
                    "Model Deployment & MLOps": 4.0
                },

                strongest_skill: "Python Programming",
                weakest_skill: "Model Deployment & MLOps",
                average_score: 4.27
            },
            {
                snapshot_id: 6,
                user_id: "user-2",
                learning_path_id: 2,
                snapshot_date: new Date("2025-03-25"),

                skill_data: {
                    "Kotlin Programming": 3.8,
                    "UI/UX Design": 3.0,
                    "Data Management": 2.7,
                    "Networking & API": 2.9,
                    "Architecture & Testing": 1.8,
                    "Performance & Security": 1.5
                },

                strongest_skill: "Kotlin Programming",
                weakest_skill: "Performance & Security",
                average_score: 2.62
            }

        ]);

        console.log('✓ Snapshot seeded');

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();