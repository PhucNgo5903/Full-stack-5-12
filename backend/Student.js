const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bài 1, Bước 5: Định nghĩa Schema cho Student
const studentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true }
}, { 
    collection: 'students' 
});

module.exports = mongoose.model('Student', studentSchema);