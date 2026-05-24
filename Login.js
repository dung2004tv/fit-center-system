import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5297/api/Auth/login', {
                username: username,
                password: password
            });

            localStorage.setItem('user', JSON.stringify(response.data));
            alert(`Đăng nhập thành công! Chào ${response.data.fullName}`);
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>F</div>
                    <h2 style={styles.title}>HỆ THỐNG QUẢN LÝ TRUNG TÂM ĐÀO TẠO CHỨNG CHỈ TIN HỌC FIT</h2>
                    <p style={styles.subtitle}>Trung tâm tin học FIT Center</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Tên đăng nhập</label>
                        <input 
                            type="text" 
                            style={styles.input} 
                            placeholder="Nhập username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input 
                            type="password" 
                            style={styles.input} 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP HỆ THỐNG'}
                    </button>
                </form>

                <div style={styles.extraLinks}>
                    <span>Quên mật khẩu?</span>
                    <span>Đăng ký tài khoản mới</span>
                </div>
                
                <div style={styles.footer}>
                    <p>© 2026 FIT Center - Project by Dũng</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#f0f2f5', 
        backgroundImage: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
        width: '100%', maxWidth: '450px', padding: '40px', backgroundColor: '#fff',
        borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid #fff'
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    logo: { 
        width: '70px', height: '70px', backgroundColor: '#0062cc', color: '#fff', 
        borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '32px', fontWeight: 'bold', margin: '0 auto 20px',
        boxShadow: '0 8px 16px rgba(0,98,204,0.3)'
    },
    title: { 
        fontSize: '18px', color: '#1a1a1a', margin: '0', 
        lineHeight: '1.4', fontWeight: '700', textTransform: 'uppercase' 
    },
    subtitle: { fontSize: '13px', color: '#6c757d', marginTop: '8px' },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '8px' },
    input: {
        width: '100%', padding: '14px 18px', borderRadius: '10px', border: '1px solid #dcdfe6',
        fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s',
        backgroundColor: '#f9f9f9'
    },
    button: {
        width: '100%', padding: '16px', borderRadius: '10px', border: 'none',
        backgroundColor: '#007bff', color: '#fff', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px',
        boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
    },
    extraLinks: {
        display: 'flex', justifyContent: 'space-between', marginTop: '20px',
        fontSize: '13px', color: '#007bff', cursor: 'pointer'
    },
    footer: { marginTop: '35px', textAlign: 'center', fontSize: '12px', color: '#999' }
};

export default Login;