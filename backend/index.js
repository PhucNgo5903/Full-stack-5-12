const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Student = require('./Student'); // Bài 1, Bước 5: Import Model

const app = express();
const PORT = 5000;

// Bài 1, Bước 2: Middleware
app.use(cors()); 
app.use(express.json()); 

// Bài 1, Bước 4: Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db') 
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));


// ====================================================================
// API Routes (CRUD)
// ====================================================================

// Bài 1, Bước 6: GET danh sách học sinh (Có thể hỗ trợ Tìm kiếm cho Bài 5)
app.get('/api/students', async (req, res) => {
    try {
        const { name } = req.query; 
        let students;

        if (name) {
            // Logic tìm kiếm theo tên (nếu backend xử lý)
            students = await Student.find({
                name: { $regex: new RegExp(name, 'i') } 
            });
        } else {
            // Lấy tất cả
            students = await Student.find();
        }

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bài 3, Bước 2: GET chi tiết một học sinh theo ID 
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Bài 2, Bước 1: POST thêm học sinh mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body); 
        res.status(201).json(newStudent); 
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


// Bài 3, Bước 1: PUT cập nhật học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedStu) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(updatedStu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Bài 4, Bước 1: DELETE xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Student.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Student not found" });
        }
        // Bài 4, Bước 1: Trả về thông báo
        res.json({ message: "Đã xóa học sinh", id: deleted._id }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Bài 1, Bước 2: Server Listen
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});