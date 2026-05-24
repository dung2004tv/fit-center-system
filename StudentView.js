import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Book, Star, PlayCircle, Clock, Send, 
    ChevronLeft, Info, Calendar, CheckCircle, 
    ArrowRight, Search, Layout 
} from 'lucide-react';

const StudentView = ({ studentId }) => {
    const [view, setView] = useState('all');
    const [classes, setClasses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    // State Thi Online
    const [isExamining, setIsExamining] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentExamCourse, setCurrentExamCourse] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 phút

    const fetchData = useCallback(async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const allRes = await axios.get('http://localhost:5297/api/Course/all-classes');
            setClasses(allRes.data || []);
            const myRes = await axios.get(`http://localhost:5297/api/Course/my-courses/${studentId}`);
            setMyCourses(myRes.data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Đếm ngược thời gian thi
    useEffect(() => {
        let timer;
        if (isExamining && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isExamining) {
            handleSubmitExam(); 
        }
        return () => clearInterval(timer);
    }, [isExamining, timeLeft]);

    const handleEnroll = async (classId, courseName) => {
        try {
            await axios.post('http://localhost:5297/api/Course/enroll', { 
                studentId: parseInt(studentId),
                classId: parseInt(classId) 
            });
            
            alert(`✅ Đăng ký thành công lớp ${courseName}!`);
            
            if (window.confirm("🔔 Bạn có muốn đặt thông báo nhắc lịch thi cho môn này không?")) {
                alert("⏰ Đã thêm vào danh sách nhắc lịch trên Dashboard!");
            }

            await fetchData(); 
            setView('my'); 
        } catch (error) {
            alert(`❌ ${error.response?.data || "Lỗi đăng ký"}`);
        }
    };

    const handleStartExam = async (course) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5297/api/Question/by-course/${course.courseId}`);
            if (res.data.length === 0) {
                alert("⚠️ Môn này chưa có câu hỏi thi trong hệ thống!");
                return;
            }
            setQuestions(res.data);
            setCurrentExamCourse(course);
            setUserAnswers({});
            setTimeLeft(600);
            setIsExamining(true);
            setView('exam');
        } catch (error) {
            alert("❌ Không thể tải đề thi!");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitExam = async () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) correctCount++;
        });

        const score = ((correctCount / questions.length) * 10).toFixed(1);

        try {
            await axios.post('http://localhost:5297/api/Question/submit', {
                studentId: parseInt(studentId),
                courseId: currentExamCourse.courseId,
                score: parseFloat(score)
            });
            alert(`🎉 Hoàn thành! Điểm của Dũng là: ${score}/10`);
            setIsExamining(false);
            setView('my');
        } catch (error) {
            alert("❌ Lỗi lưu kết quả thi!");
        }
    };

    if (loading && classes.length === 0) return <div style={styles.loading}>Đang chuẩn bị dữ liệu...</div>;

    return (
        <div style={styles.container}>
            {/* Thanh điều hướng Header */}
            {view !== 'exam' && (
                <div style={styles.tabBar}>
                    <button onClick={() => setView('all')} style={view === 'all' ? styles.tabActive : styles.tab}>
                        <Layout size={18} /> Khám phá lớp học
                    </button>
                    <button onClick={() => setView('my')} style={view === 'my' ? styles.tabActive : styles.tab}>
                        <Star size={18} /> Khóa học của tôi
                    </button>
                </div>
            )}

            {/* VIEW 1: TẤT CẢ LỚP HỌC */}
            {view === 'all' && (
                <div style={styles.grid}>
                    {classes.map(c => (
                        <div key={c.classId} style={styles.courseCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.iconCircle}><Book size={24} color="#4318ff"/></div>
                                <span style={styles.priceBadge}>{c.price?.toLocaleString()}đ</span>
                            </div>
                            <h4 style={styles.cardTitle}>{c.courseName}</h4>
                            <p style={styles.cardLecturer}>👨‍🏫 Giảng viên: {c.lecturer}</p>
                            <div style={styles.cardFooter}>
                                <button style={styles.btnGhost} onClick={() => {setSelectedCourse(c); setView('detail');}}>Lộ trình</button>
                                <button style={styles.btnPrimary} onClick={() => handleEnroll(c.classId, c.courseName)}>Đăng ký</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW 2: CHI TIẾT LỘ TRÌNH */}
            {view === 'detail' && selectedCourse && (
                <div style={styles.whiteBox}>
                    <button onClick={() => setView('all')} style={styles.btnBack}><ChevronLeft size={20}/> Quay lại</button>
                    <h2 style={{color: '#2b3674', marginTop: '20px'}}>{selectedCourse.courseName}</h2>
                    <p style={{color: '#a3aed0'}}>Chi tiết các bước học tập của bạn:</p>
                    <div style={styles.roadmap}>
                        {selectedCourse.syllabus?.split('|').map((step, i) => (
                            <div key={i} style={styles.roadmapStep}>
                                <div style={styles.stepNum}>{i + 1}</div>
                                <span>{step.trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW 3: KHÓA HỌC CỦA TÔI */}
            {view === 'my' && (
                <div style={styles.grid}>
                    {myCourses.map(c => (
                        <div key={c.id} style={styles.myCourseCard}>
                            <div style={styles.statusRow}>
                                <span style={styles.activeBadge}>{c.status || 'Đang học'}</span>
                                <Calendar size={16} color="#a3aed0" />
                            </div>
                            <h4 style={styles.cardTitle}>{c.courseName}</h4>
                            <button style={styles.btnExam} onClick={() => handleStartExam(c)}>
                                <PlayCircle size={18} /> VÀO THI ONLINE
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW 4: MÀN HÌNH THI */}
            {view === 'exam' && (
                <div style={styles.examWrapper}>
                    <div style={styles.examHeader}>
                        <div>
                            <h2 style={{margin: 0, color: '#2b3674'}}>📝 {currentExamCourse?.courseName}</h2>
                            <p style={{margin: 0, color: '#a3aed0'}}>Vui lòng chọn đáp án đúng nhất</p>
                        </div>
                        <div style={styles.timerBox}>
                            <Clock size={20} />
                            <span>{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    <div style={styles.questionsList}>
                        {questions.map((q, index) => (
                            <div key={q.id} style={styles.qCard}>
                                <p style={styles.qContent}><strong>Câu {index + 1}:</strong> {q.content}</p>
                                <div style={styles.optionsGrid}>
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <label key={opt} style={{
                                            ...styles.optionItem,
                                            backgroundColor: userAnswers[q.id] === opt ? '#eef2ff' : '#fff',
                                            borderColor: userAnswers[q.id] === opt ? '#4318ff' : '#e2e8f0'
                                        }}>
                                            <input 
                                                type="radio" 
                                                style={{display: 'none'}}
                                                name={`q${q.id}`} 
                                                onChange={() => setUserAnswers({...userAnswers, [q.id]: opt})} 
                                            />
                                            <span style={{fontWeight: 'bold', color: userAnswers[q.id] === opt ? '#4318ff' : '#2b3674'}}>{opt}.</span>
                                            {q[`option${opt}`]}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={styles.btnSubmitFinal} onClick={handleSubmitExam}>
                        <Send size={18} /> NỘP BÀI THI NGAY
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
    loading: { textAlign: 'center', padding: '50px', color: '#4318ff', fontWeight: 'bold' },
    tabBar: { display: 'flex', gap: '15px', marginBottom: '30px', backgroundColor: '#fff', padding: '10px', borderRadius: '15px', width: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
    tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: 'none', background: 'transparent', color: '#a3aed0', cursor: 'pointer', borderRadius: '10px', fontWeight: '600' },
    tabActive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: 'none', background: '#4318ff', color: '#fff', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(67, 24, 255, 0.3)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    courseCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.2s' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    iconCircle: { width: '50px', height: '50px', backgroundColor: '#f4f7fe', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    priceBadge: { backgroundColor: '#fff7ed', color: '#ea580c', padding: '5px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold' },
    cardTitle: { fontSize: '18px', color: '#2b3674', margin: '10px 0' },
    cardLecturer: { color: '#a3aed0', fontSize: '14px', marginBottom: '20px' },
    cardFooter: { display: 'flex', gap: '10px' },
    btnPrimary: { flex: 1, padding: '12px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    btnGhost: { flex: 0.6, padding: '12px', backgroundColor: 'transparent', color: '#4318ff', border: '1px solid #4318ff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    myCourseCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '25px', borderLeft: '8px solid #4318ff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    statusRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    activeBadge: { color: '#05cd99', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '8px' },
    btnExam: { width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#ee5d50', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    whiteBox: { backgroundColor: '#fff', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    btnBack: { display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'transparent', color: '#4318ff', fontWeight: 'bold', cursor: 'pointer' },
    roadmap: { marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' },
    roadmapStep: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#f4f7fe', borderRadius: '15px' },
    stepNum: { width: '30px', height: '30px', backgroundColor: '#4318ff', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
    examWrapper: { maxWidth: '800px', margin: '0 auto' },
    examHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '20px', position: 'sticky', top: '10px', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    timerBox: { display: 'flex', alignItems: 'center', gap: '8px', color: '#ee5d50', fontSize: '24px', fontWeight: 'bold' },
    questionsList: { marginTop: '30px' },
    qCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    qContent: { fontSize: '16px', color: '#2b3674', lineHeight: '1.6', marginBottom: '20px' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    optionItem: { padding: '15px', borderRadius: '15px', border: '2px solid', cursor: 'pointer', display: 'flex', gap: '10px', fontSize: '14px', transition: '0.2s' },
    btnSubmitFinal: { width: '100%', padding: '18px', backgroundColor: '#05cd99', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(5, 205, 153, 0.3)' }
};

export default StudentView;