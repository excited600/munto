import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setEmail as setEmailAction } from '../authSlice';
import { RootState, AppDispatch } from '../store';
import { API_ENDPOINTS } from '../api/config';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 201) {
        const data = await res.json();
        dispatch(setAccessToken(data.access_token));
        dispatch(setEmailAction(data.email));
        navigate('/');
      } else {
        alert('로그인에 실패하셨습니다');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavigationBar />
      {accessToken ? (
        <div style={{ maxWidth: 500, margin: '60px auto 0', textAlign: 'center', fontSize: 22, fontWeight: 500, color: '#888' }}>
          이미 로그인을 하셨습니다
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{
          maxWidth: 500,
          margin: '60px auto 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 16px',
        }}>
          <h1 style={{ fontWeight: 600, fontSize: 40, marginBottom: 40 }}>MUNTO</h1>
          <div style={{ width: '100%', marginBottom: 20 }}>
            <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>이메일</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=""
                style={{
                  width: '100%',
                  padding: '16px 44px 16px 16px',
                  fontSize: 18,
                  border: '1px solid #e5e5e5',
                  borderRadius: 10,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
              {email && (
                <button type="button" onClick={() => setEmail('')} style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  color: '#bbb',
                  cursor: 'pointer',
                }}>×</button>
              )}
            </div>
          </div>
          <div style={{ width: '100%', marginBottom: 32 }}>
            <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>비밀번호</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=""
                style={{
                  width: '100%',
                  padding: '16px 44px 16px 16px',
                  fontSize: 18,
                  border: '1px solid #e5e5e5',
                  borderRadius: 10,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
              {password && (
                <button type="button" onClick={() => setPassword('')} style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  color: '#bbb',
                  cursor: 'pointer',
                }}>×</button>
              )}
            </div>
          </div>
          <button type="submit" style={{
            width: '100%',
            padding: '16px 0',
            background: '#ff3b30',
            color: '#fff',
            fontWeight: 600,
            fontSize: 20,
            border: 'none',
            borderRadius: 40,
            marginBottom: 24,
            cursor: 'pointer',
          }}>로그인</button>
          <button type="button" onClick={handleSignup} style={{
            width: '100%',
            padding: '16px 0',
            background: '#fff',
            color: '#222',
            fontWeight: 500,
            fontSize: 20,
            border: '1.5px solid #e5e5e5',
            borderRadius: 40,
            cursor: 'pointer',
          }}>회원가입</button>
        </form>
      )}
    </div>
  );
};

export default Login;
