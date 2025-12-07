import React, { useState } from 'react';

// Component hỗ trợ Sửa (tách ra để dễ quản lý state cho Bài 3)
const EditStudentForm = ({ student, onUpdate, onCancel }) => {
    // Bài 3, Bước 2: Quản lý state cục bộ cho form
    const [name, setName] = useState(student.name);
    const [age, setAge] = useState(student.age);
    const [stuClass, setStuClass] = useState(student.class);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Bài 3, Bước 3: Gửi dữ liệu cập nhật
        onUpdate(student._id, { 
            name, 
            age: Number(age), 
            class: stuClass 
        });
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            <h3>Chỉnh sửa Học sinh: {student.name}</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Họ tên" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Tuổi" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Lớp" 
                    value={stuClass} 
                    onChange={e => setStuClass(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}>Lưu Cập nhật</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Hủy</button>
            </form>
        </div>
    );
};

export default EditStudentForm;