import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Edit, Trash2, Plus, X } from 'lucide-react';

const TeacherView = ({ teacherId }) => {
    const [subView, setSubView] = useState('dashboard');
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0 });

    // Cấu hình State phục vụ Form popup Thêm / Sửa môn học
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [currentCourse, setCurrentCourse] = useState({ id: 0, courseName: '', price: '' });

    // Gọi API lấy dữ liệu thực tế từ hệ thống khi teacherId thay đổi
    useEffect(() => {
        if (!teacherId) return;

        // 1. Lấy số liệu tổng quan hiển thị lên Dashboard của giáo viên
        fetch(`http://localhost:5000/api/ExamResult/teacher-dashboard/${teacherId}`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
            })
            .catch(err => console.error("Lỗi lấy thông tin dashboard:", err));

        // 2. Lấy danh sách chi tiết các khóa học được phân công
        fetch(`http://localhost:5000/api/Course/teacher/${teacherId}`)
            .then(res => res.json())
            .then(data => {
                setCourses(data);
            })
            .catch(err => console.error("Lỗi lấy danh sách môn học:", err));

        // 3. ĐÃ SỬA: Gọi đúng Route của ExamResultController để quét bảng điểm thật của học viên
        fetch(`http://localhost:5000/api/ExamResult/teacher-grades/${teacherId}`)
            .then(res => res.json())
            .then(data => {
                setGrades(data);
            })
            .catch(err => console.error("Lỗi lấy bảng điểm thật từ hệ thống:", err));

    }, [teacherId]);

    // Hàm xử lý Xóa khóa học
    const handleDeleteCourse = (courseId) => {
        if(window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
            fetch(`http://localhost:5000/api/Course/${courseId}`, { method: 'DELETE' })
                .then(res => {
                    if(res.ok) {
                        setCourses(courses.filter(c => c.id !== courseId));
                        setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
                        alert("Xóa khóa học thành công!");
                    }
                })
                .catch(err => alert("Lỗi hệ thống khi xóa khóa học: " + err));
        }
    };

    // Hàm xử lý khi nhấn nút Thêm khóa mới
    const openAddModal = () => {
        setModalType('add');
        setCurrentCourse({ id: 0, courseName: '', price: '' });
        setShowModal(true);
    };

    // Hàm xử lý khi nhấn nút Sửa môn học
    const openEditModal = (course) => {
        setModalType('edit');
        setCurrentCourse({ id: course.id, courseName: course.courseName, price: course.price });
        setShowModal(true);
    };

    // Hàm thực thi gửi dữ liệu Form (Thêm hoặc Sửa) lên API Backend
    const handleSaveCourse = (e) => {
        e.preventDefault();
        const url = modalType === 'add' 
            ? `http://localhost:5000/api/Course` 
            : `http://localhost:5000/api/Course/${currentCourse.id}`;
        
        const method = modalType === 'add' ? 'POST' : 'PUT';
        
        const bodyData = modalType === 'add'
            ? { courseName: currentCourse.courseName, price: parseInt(currentCourse.price), teacherId: parseInt(teacherId) }
            : { id: currentCourse.id, courseName: currentCourse.courseName, price: parseInt(currentCourse.price), teacherId: parseInt(teacherId) };

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })
        .then(res => {
            if (res.ok) {
                alert(modalType === 'add' ? "Thêm khóa học thành công!" : "Cập nhật khóa học thành công!");
                setShowModal(false);
                window.location.reload(); // Refresh nhẹ để tải lại dữ liệu mới nhất
            } else {
                alert("Không thể lưu cấu hình khóa học, vui lòng kiểm tra lại Backend.");
            }
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
            {/* Sub Menu chuyển đổi giao diện */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <button onClick={() => setSubView('dashboard')} style={subView === 'dashboard' ? styles.tabActive : styles.tab}>🏠 Tổng quan</button>
                <button onClick={() => setSubView('courses')} style={subView === 'courses' ? styles.tabActive : styles.tab}>📚 Quản lý khóa học</button>
                <button onClick={() => setSubView('grades')} style={subView === 'grades' ? styles.tabActive : styles.tab}>🏅 Xem bảng điểm</button>
            </div>

            {/* INTERFACE 1: 🏠 TỔNG QUAN (DASHBOARD) */}
            {subView === 'dashboard' && (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ ...styles.whiteBox, flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '15px', background: '#e0e7ff', borderRadius: '12px' }}><BarChart3 color="#4318ff"/></div>
                        <div>
                            <p style={{ margin: 0, color: '#a3aed0', fontSize: '14px' }}>Khóa học đảm nhiệm</p>
                            <h2 style={{ margin: 0, color: '#1b254b' }}>{stats.totalCourses} Môn</h2>
                        </div>
                    </div>
                    <div style={{ ...styles.whiteBox, flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '15px', background: '#dcfce7', borderRadius: '12px' }}><Users color="#166534"/></div>
                        <div>
                            <p style={{ margin: 0, color: '#a3aed0', fontSize: '14px' }}>Sinh viên đã đánh giá</p>
                            <h2 style={{ margin: 0, color: '#1b254b' }}>{stats.totalStudents} Học viên</h2>
                        </div>
                    </div>
                </div>
            )}

            {/* INTERFACE 2: 📚 BẢNG QUẢN LÝ KHÓA HỌC */}
            {subView === 'courses' && (
                <div style={styles.whiteBox}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center'}}>
                        <h3 style={{ margin: 0, color: '#1b254b' }}>Danh sách khóa học giảng dạy</h3>
                        <button onClick={openAddModal} style={styles.btnPrimary}><Plus size={16}/> Thêm khóa mới</button>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={{ paddingBottom: '10px' }}>Mã môn</th>
                                <th style={{ paddingBottom: '10px' }}>Tên môn học</th>
                                <th style={{ paddingBottom: '10px' }}>Học phí</th>
                                <th style={{ paddingBottom: '10px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#a3aed0' }}>Chưa có khóa học nào được phân công.</td></tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} style={styles.tr}>
                                        <td>MS-{course.id}</td>
                                        <td><b>{course.courseName}</b></td>
                                        <td style={{color: '#ea580c', fontWeight: '600'}}>{course.price?.toLocaleString()} VNĐ</td>
                                        <td>
                                            <button onClick={() => openEditModal(course)} style={styles.iconBtn} title="Sửa môn học"><Edit size={16} color="#4318ff"/></button>
                                            <button onClick={() => handleDeleteCourse(course.id)} style={styles.iconBtn} title="Xóa môn học"><Trash2 size={16} color="#ee5d50"/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* INTERFACE 3: 🏅 BẢNG ĐIỂM SINH VIÊN */}
            {subView === 'grades' && (
                <div style={styles.whiteBox}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1b254b' }}>🏅 Kết quả thi Online của Sinh viên</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={{ paddingBottom: '10px' }}>Sinh viên</th>
                                <th style={{ paddingBottom: '10px' }}>Môn thi</th>
                                <th style={{ paddingBottom: '10px' }}>Điểm số</th>
                                <th style={{ paddingBottom: '10px' }}>Số câu đúng</th>
                                <th style={{ paddingBottom: '10px' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#a3aed0' }}>Chưa có sinh viên nào làm bài thi.</td></tr>
                            ) : (
                                grades.map(grade => (
                                    <tr key={grade.id} style={styles.tr}>
                                        {/* ĐÃ SỬA: Lấy chính xác thuộc tính tên phẳng từ API DTO */}
                                        <td><b>{grade.studentName}</b></td>
                                        <td>{grade.courseName}</td>
                                        <td style={{fontWeight: 'bold', color: '#4318ff', fontSize: '16px'}}>{grade.score}</td>
                                        <td>{grade.totalCorrect}/{grade.totalQuestions}</td>
                                        <td>
                                            <span style={grade.score >= 5 ? styles.badgePass : styles.badgeFail}>
                                                {grade.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* POPUP MODAL THÊM / SỬA KHÓA HỌC */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{modalType === 'add' ? '✨ Thêm Khóa Học Mới' : '📝 Cập Nhật Khóa Học'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveCourse}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tên môn học:</label>
                                <input 
                                    type="text" 
                                    required
                                    value={currentCourse.courseName}
                                    onChange={(e) => setCurrentCourse({...currentCourse, courseName: e.target.value})}
                                    style={styles.input} 
                                    placeholder="Ví dụ: Lập trình Web API với ASP.NET Core"
                                />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Học phí (VNĐ):</label>
                                <input 
                                    type="number" 
                                    required
                                    value={currentCourse.price}
                                    onChange={(e) => setCurrentCourse({...currentCourse, price: e.target.value})}
                                    style={styles.input} 
                                    placeholder="Ví dụ: 5000000"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.btnSecondary}>Hủy</button>
                                <button type="submit" style={styles.btnPrimary}>Lưu dữ liệu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    whiteBox: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '20px' },
    tab: { padding: '10px 20px', border: 'none', background: '#e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', color: '#4a5568', transition: '0.2s' },
    tabActive: { padding: '10px 20px', border: 'none', background: '#4318ff', color: '#fff', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { textAlign: 'left', color: '#a3aed0', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f8fafc', height: '60px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', marginRight: '5px' },
    badgePass: { padding: '5px 12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
    badgeFail: { padding: '5px 12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
    btnPrimary: { display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    btnSecondary: { padding: '10px 20px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    modalContent: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }
};

export default TeacherView;