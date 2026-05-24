import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, UserCircle, BookOpen, GraduationCap, 
    LogOut, Bell, Search, Calendar, Lock, Zap 
} from 'lucide-react'; 

import StudentView from './StudentView';
import TeacherView from './TeacherView';

const COLORS = {
    primary: '#0061ff',
    secondary: '#60efff',
    background: '#f0f4f8',
    textDark: '#1a202c',
    textLight: '#718096',
    white: '#ffffff',
    danger: '#ff4d4f',
    success: '#00c853'
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeMenu, setActiveMenu] = useState('tongquan');
    const [stats, setStats] = useState({ courseCount: 14, studentCount: 19 });

    const fetchStats = useCallback(async () => {
        try {
            const resC = await axios.get('http://localhost:5297/api/Course/count');
            const resS = await axios.get('http://localhost:5297/api/Student/count');
            setStats({ 
                courseCount: resC.data || 14, 
                studentCount: resS.data || 19 
            });
        } catch (err) {
            setStats({ courseCount: 14, studentCount: 19 });
        }
    }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(loggedInUser);
            setUser(parsedUser);
            fetchStats();
        }
    }, [navigate, fetchStats]);

    const handleLogout = () => {
        if (window.confirm("Xác nhận đăng xuất?")) {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    if (!user) return <div style={styles.loading}>🛸 Đang nạp hệ thống...</div>;

    return (
        <div style={styles.dashboardWrapper}>
            {/* --- THANH NAVBAR TRÊN ĐẦU (THAY CHO BÊN TRÁI) --- */}
            <header style={styles.navbar}>
                <div style={styles.navContainer}>
                    <div style={styles.logoBox}>
                        <div style={styles.logoIcon}>F</div>
                        <h2 style={styles.logoText}>FIT CENTER</h2>
                    </div>

                    <nav style={styles.navLinks}>
                        <NavItem icon={<LayoutDashboard size={18}/>} label="Tổng quan" active={activeMenu === 'tongquan'} onClick={() => setActiveMenu('tongquan')} />
                        <NavItem icon={<BookOpen size={18}/>} label="Lớp học" active={activeMenu === 'lophoc'} onClick={() => setActiveMenu('lophoc')} />
                        <NavItem icon={<GraduationCap size={18}/>} label="Thi Online" active={activeMenu === 'thi'} onClick={() => setActiveMenu('thi')} />
                        {user.role === 'Admin' && <NavItem icon={<UserCircle size={18}/>} label="Quản trị" active={activeMenu === 'admin'} onClick={() => setActiveMenu('admin')} />}
                    </nav>

                    <div style={styles.navActions}>
                        <div style={styles.searchBox}>
                            <Search size={16} color={COLORS.textLight}/>
                            <input type="text" placeholder="Tìm kiếm..." style={styles.searchInput} />
                        </div>
                        <div style={styles.userProfile}>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user.username}</span>
                                <span style={styles.userRole}>{user.role}</span>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${user.username}&background=0061ff&color=fff&bold=true`} alt="avatar" style={styles.avatar} />
                            <button onClick={handleLogout} style={styles.btnLogout}><LogOut size={18}/></button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- NỘI DUNG CHÍNH --- */}
            <main style={styles.mainArea}>
                <div style={styles.contentContainer}>
                    {activeMenu === 'tongquan' && (
                        <div style={styles.animateFade}>
                            <div style={styles.welcomeBanner}>
                                <div style={{zIndex: 2}}>
                                    <h1 style={{margin: 0, fontSize: '32px'}}>Xin chào, {user.username}! ✨</h1>
                                    <p style={{opacity: 0.9, marginTop: '10px'}}>Chúc bạn một ngày học tập và làm việc hiệu quả tại FIT Center.</p>
                                </div>
                                <img src="https://ouch-cdn2.icons8.com/thumb/250/illustrations/3d-fluency-blue-lamp.png" alt="3d" style={styles.bannerImg} />
                            </div>
                            <div style={styles.statsRow}>
                                <StatCard label="Khóa học" value={stats.courseCount} color={COLORS.primary} icon="📘" />
                                <StatCard label="Học viên" value={stats.studentCount} color={COLORS.secondary} icon="👨‍💻" />
                                <StatCard label="Hoàn thành" value="92%" color={COLORS.success} icon="✅" />
                                <StatCard label="Thông báo" value="05" color={COLORS.danger} icon="🔔" />
                            </div>
                        </div>
                    )}

                    {activeMenu === 'lophoc' && (
                        user.role === 'Student' ? <StudentView studentId={user.id} /> : <TeacherView teacherId={user.id} />
                    )}

                    {activeMenu === 'thi' && (
                        <div style={styles.examGridWrapper}>
                            <div style={styles.examHeaderRow}>
                                <div style={styles.iconCircleBig}><Zap size={30} color={COLORS.danger}/></div>
                                <div>
                                    <h2 style={styles.examTitle}>DANH SÁCH MÔN THI</h2>
                                    <p style={styles.examSubTitle}>Hệ thống thi đang được bảo trì phần chấm điểm tự động.</p>
                                </div>
                            </div>
                            <div style={styles.grid}>
                                <ExamCard title="ASP.NET Core" />
                                <ExamCard title="Linux" />
                                <ExamCard title="Tester" />
                                <ExamCard title="Microservices" />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// --- Sub-components ---
const NavItem = ({ icon, label, active, onClick }) => (
    <div style={active ? styles.navItemActive : styles.navItem} onClick={onClick}>
        {icon} <span style={{marginLeft: '8px'}}>{label}</span>
    </div>
);

const StatCard = ({ label, value, color, icon }) => (
    <div style={styles.statBox}>
        <div style={{...styles.statIconCircle, border: `2px solid ${color}`}}>{icon}</div>
        <div><p style={styles.statLabel}>{label}</p><h3 style={{margin: 0, fontSize: '24px'}}>{value}</h3></div>
    </div>
);

const ExamCard = ({ title }) => (
    <div style={styles.examCard}>
        <div style={styles.iconCircle}><BookOpen size={20}/></div>
        <h4 style={{margin: '10px 0'}}>{title}</h4>
        <button style={styles.btnNotOpen} disabled><Lock size={14} style={{marginRight: '6px'}}/> CHƯA MỞ</button>
    </div>
);

const styles = {
    dashboardWrapper: { minHeight: '100vh', backgroundColor: COLORS.background, fontFamily: "'Inter', sans-serif" },
    navbar: { height: '75px', backgroundColor: COLORS.white, borderBottom: `2px solid ${COLORS.primary}22`, position: 'sticky', top: 0, zIndex: 1000 },
    navContainer: { maxWidth: '1400px', margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: { width: '38px', height: '38px', background: COLORS.primary, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: COLORS.white },
    logoText: { fontSize: '20px', margin: 0, fontWeight: '900', color: COLORS.primary },
    navLinks: { display: 'flex', gap: '8px' },
    navItem: { display: 'flex', alignItems: 'center', padding: '10px 18px', cursor: 'pointer', borderRadius: '12px', color: COLORS.textLight, fontWeight: '600', fontSize: '14px' },
    navItemActive: { display: 'flex', alignItems: 'center', padding: '10px 18px', cursor: 'pointer', borderRadius: '12px', color: COLORS.white, backgroundColor: COLORS.primary, fontWeight: '700', fontSize: '14px' },
    navActions: { display: 'flex', alignItems: 'center', gap: '20px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#e2e8f0', padding: '8px 15px', borderRadius: '10px', width: '180px' },
    searchInput: { border: 'none', background: 'none', outline: 'none', fontSize: '13px', width: '100%' },
    userProfile: { display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '15px', borderLeft: '2px solid #eee' },
    userInfo: { display: 'flex', flexDirection: 'column', textAlign: 'right' },
    userName: { fontSize: '13px', fontWeight: 'bold' },
    userRole: { fontSize: '11px', color: COLORS.primary },
    avatar: { width: '35px', height: '35px', borderRadius: '8px' },
    btnLogout: { background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' },
    mainArea: { padding: '40px 0' },
    contentContainer: { maxWidth: '1400px', margin: '0 auto', padding: '0 25px' },
    welcomeBanner: { background: `linear-gradient(135deg, ${COLORS.primary} 0%, #003594 100%)`, padding: '40px', borderRadius: '30px', color: COLORS.white, display: 'flex', position: 'relative', overflow: 'hidden', marginBottom: '30px' },
    bannerImg: { width: '180px', position: 'absolute', right: '40px', bottom: '-20px' },
    statsRow: { display: 'flex', gap: '20px' },
    statBox: { flex: 1, padding: '20px', backgroundColor: COLORS.white, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
    statIconCircle: { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    statLabel: { color: COLORS.textLight, fontSize: '13px', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    examCard: { backgroundColor: COLORS.white, padding: '25px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    btnNotOpen: { padding: '8px 15px', backgroundColor: '#e2e8f0', color: '#718096', border: 'none', borderRadius: '15px', fontSize: '12px', cursor: 'not-allowed' },
    examHeaderRow: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: COLORS.white, padding: '20px', borderRadius: '20px', marginBottom: '20px' },
    iconCircleBig: { width: '50px', height: '50px', backgroundColor: '#fee2e2', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    loading: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: COLORS.primary, fontWeight: 'bold' }
};

export default Dashboard;