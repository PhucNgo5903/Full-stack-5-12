import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditStudentForm from './EditStudentForm'; 

const API_URL = 'http://localhost:5000/api/students';

// Định nghĩa các Style cơ bản
const styles = {
    // Container chính của ứng dụng
    appContainer: {
        padding: '30px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
    },
    // Tiêu đề chính
    header: {
        textAlign: 'center',
        color: '#007bff',
        marginBottom: '40px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    // Tiêu đề phụ (Form Thêm)
    subHeader: {
        marginTop: '30px',
        color: '#343a40',
        paddingBottom: '5px',
    },
    // Form Thêm học sinh
    addForm: {
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
        flexGrow: 1,
    },
    primaryButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff', // Màu xanh dương chính
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    // Thanh công cụ (Tìm kiếm, Sắp xếp)
    toolbar: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'flex-start', // Căn chỉnh về bên trái/giữa
        padding: '10px 0',
    },
    // Bảng
    table: {
        width: '100%',
        borderCollapse: 'separate', // Dùng separate để có border radius
        borderRadius: '8px',
        overflow: 'hidden', // Quan trọng để bo góc hoạt động
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 15px',
        textAlign: 'left',
    },
    tableCell: {
        padding: '12px 15px',
        borderBottom: '1px solid #dee2e6',
        backgroundColor: '#fff',
    },
    actionButton: {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '8px',
    },
};


function App() {
    // Bài 1, Bước 7: State quản lý danh sách
    const [students, setStudents] = useState([]); 
    // Bài 2, Bước 2: State quản lý form Thêm
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [stuClass, setStuClass] = useState("");

    // Bài 3, Bước 2: State cho chức năng Sửa 
    const [editingStudent, setEditingStudent] = useState(null); 

    // Bài 5, Bước 1: State cho chức năng Tìm kiếm 
    const [searchTerm, setSearchTerm] = useState(""); 

    // Bài 6, Bước 1: State cho chức năng Sắp xếp 
    const [sortAsc, setSortAsc] = useState(true); 

    // Bài 1, Bước 7: Fetch danh sách học sinh khi component load
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get(API_URL)
            // Bài 1, Bước 7: Cập nhật state students
            .then(response => setStudents(response.data)) 
            .catch(error => console.error("Lỗi khi fetch danh sách:", error));
    };

    // Bài 2, Bước 3: Xử lý thêm học sinh mới
    const handleAddStudent = (e) => {
        e.preventDefault();
        const newStu = { name, age: Number(age), class: stuClass };

        axios.post(API_URL, newStu)
            .then(res => {
                console.log("Đã thêm:", res.data);
                // Bài 2, Bước 3: Cập nhật state students 
                setStudents(prev => [...prev, res.data]);
                // Bài 2, Bước 3: Xóa nội dung form
                setName(""); setAge(""); setStuClass("");
            })
            .catch(err => console.error("Lỗi khi thêm:", err));
    };

    // Bài 3, Bước 3: Xử lý cập nhật học sinh
    const handleUpdateStudent = (id, updatedData) => {
        axios.put(`${API_URL}/${id}`, updatedData)
            .then(res => {
                console.log("Đã cập nhật:", res.data);
                // Bài 3, Bước 4: Cập nhật danh sách students
                setStudents(prev => prev.map(s => s._id === id ? res.data : s));
                setEditingStudent(null); 
            })
            .catch(err => console.error("Lỗi khi cập nhật:", err));
    };

    // Bài 4, Bước 3: Xử lý xóa học sinh
    const handleDelete = (id) => {
        // Bài 4, Bước 3: Xác nhận trước khi xóa
        if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return; 
        
        axios.delete(`${API_URL}/${id}`)
            .then(res => {
                console.log(res.data.message);
                // Bài 4, Bước 3: Tự xóa phần tử khỏi mảng students trong state
                setStudents(prevList => prevList.filter(s => s._id !== id));
            })
            .catch(err => console.error("Lỗi khi xóa:", err));
    };
    
    // ====================================================================
    // Logic Lọc (Bài 5) và Sắp xếp (Bài 6)
    // ====================================================================

    // Bài 5, Bước 2: Lọc danh sách theo tên (Client-side filtering)
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bài 6, Bước 2: Sắp xếp danh sách đã lọc
    const sortedStudents = [...filteredStudents].sort((a, b) => { // Sao chép mảng
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        
        // Bài 6, Bước 2: Logic so sánh theo sortAsc
        if (nameA < nameB) return sortAsc ? -1 : 1;
        if (nameA > nameB) return sortAsc ? 1 : -1;
        return 0;
    });

    // ====================================================================
    // Render
    // ====================================================================

    return (
        <div style={styles.appContainer}>
            <h1 style={styles.header}> Ứng dụng Quản lý Học sinh</h1>

            {/* Bài 3, Bước 2: Hiển thị Form Chỉnh sửa */}
            {editingStudent && (
                <EditStudentForm 
                    student={editingStudent} 
                    onUpdate={handleUpdateStudent} 
                    onCancel={() => setEditingStudent(null)}
                />
            )}

            {/* Bài 2, Bước 2: Form Thêm Học sinh */}
            <h2 style={styles.subHeader}>+ Thêm Học sinh mới</h2>
            <form onSubmit={handleAddStudent} style={styles.addForm}>
                <input 
                    type="text" 
                    placeholder="Họ tên" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <input 
                    type="number" 
                    placeholder="Tuổi" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    required 
                    style={{ ...styles.input, flexGrow: 0, width: '80px' }}
                />
                <input 
                    type="text" 
                    placeholder="Lớp" 
                    value={stuClass} 
                    onChange={e => setStuClass(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <button type="submit" style={styles.primaryButton}>Thêm học sinh</button>
            </form>
            
            <h2 style={{...styles.subHeader, textAlign: 'center', marginTop: '50px'}}>Danh sách Học sinh</h2>

            {/* Bài 5 & 6: Thanh điều khiển */}
            <div style={styles.toolbar}>
                {/* Bài 5, Bước 1: Input Tìm kiếm */}
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={styles.input}
                />

                {/* Bài 6, Bước 1: Nút Sắp xếp */}
                <button onClick={() => setSortAsc(prev => !prev)} style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}>
                    {sortAsc ? 'Tên: A → Z' : 'Tên: Z → A'}
                </button>
                <span style={{ color: '#6c757d' }}>({sortedStudents.length} học sinh)</span>
            </div>


            {/* Bài 1, Bước 7: Hiển thị danh sách */}
            {sortedStudents.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#dc3545' }}>Chưa có học sinh nào hoặc không tìm thấy kết quả.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.tableHeader, borderTopLeftRadius: '8px'}}>Họ tên</th>
                            <th style={styles.tableHeader}>Tuổi</th>
                            <th style={styles.tableHeader}>Lớp</th>
                            <th style={{...styles.tableHeader, borderTopRightRadius: '8px', width: '150px'}}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Bài 1, Bước 7: Render danh sách đã sắp xếp/lọc */}
                        {sortedStudents.map((student, index) => (
                            <tr key={student._id} style={{backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff'}}>
                                <td style={styles.tableCell}>{student.name}</td>
                                <td style={styles.tableCell}>{student.age}</td>
                                <td style={styles.tableCell}>{student.class}</td>
                                <td style={{...styles.tableCell, display: 'flex', gap: '5px'}}>
                                    {/* Bài 3, Bước 2: Nút Sửa */}
                                    <button 
                                        onClick={() => setEditingStudent(student)}
                                        style={{...styles.actionButton, backgroundColor: '#ffc107', color: 'white'}}
                                    >Sửa</button> 
                                    {/* Bài 4, Bước 2: Nút Xóa */}
                                    <button 
                                        onClick={() => handleDelete(student._id)}
                                        style={{...styles.actionButton, backgroundColor: '#dc3545', color: 'white'}}
                                    >Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;