import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ id: 0, courseName: '', price: 0, duration: '', description: '', syllabus: '' });
    const [isEdit, setIsEdit] = useState(false);

    const loadCourses = async () => {
        const res = await axios.get('http://localhost:5297/api/Course');
        setCourses(res.data);
    };

    useEffect(() => { loadCourses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            await axios.put(`http://localhost:5297/api/Course/${form.id}`, form);
        } else {
            await axios.post('http://localhost:5297/api/Course', form);
        }
        setForm({ id: 0, courseName: '', price: 0, duration: '', description: '', syllabus: '' });
        setIsEdit(false);
        loadCourses();
        alert("Thao tác thành công!");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Dũng có chắc muốn xóa khóa học này không?")) {
            await axios.delete(`http://localhost:5297/api/Course/${id}`);
            loadCourses();
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>🛠️ QUẢN LÝ KHÓA HỌC</h3>
            
            {/* Form Thêm/Sửa */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gap: '10px', background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
                <input type="text" placeholder="Tên khóa học" value={form.courseName} onChange={e => setForm({...form, courseName: e.target.value})} required />
                <input type="number" placeholder="Giá" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} required />
                <input type="text" placeholder="Thời gian (ví dụ: 6 tuần)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                <textarea placeholder="Lộ trình (ngăn cách bởi dấu |)" value={form.syllabus} onChange={e => setForm({...form, syllabus: e.target.value})} />
                <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>
                    {isEdit ? "CẬP NHẬT" : "THÊM MỚI"}
                </button>
                {isEdit && <button onClick={() => {setIsEdit(false); setForm({id:0, courseName:'', price:0, duration:'', description:'', syllabus:''})}}>Hủy</button>}
            </form>

            {/* Bảng danh sách */}
            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: '#1e293b', color: 'white' }}>
                        <th>Tên môn</th>
                        <th>Giá</th>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(c => (
                        <tr key={c.id}>
                            <td>{c.courseName}</td>
                            <td>{c.price.toLocaleString()}</td>
                            <td>{c.duration}</td>
                            <td>
                                <button onClick={() => { setForm(c); setIsEdit(true); }}>Sửa</button>
                                <button onClick={() => handleDelete(c.id)} style={{ color: 'red' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseManagement;