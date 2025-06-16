import React, { useState, ChangeEvent } from 'react';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState('');
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImageUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setProfileImage(null);
      setProfileImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !nickname || !password || !introduction) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', nickname);
    formData.append('password', password);
    formData.append('introduction', introduction);
    formData.append('is_host', isHost ? 'true' : 'false');
    if (profileImage) {
      formData.append('profile_picture', profileImage);
    }

    try {
      const response = await fetch(API_ENDPOINTS.USERS.SIGNUP, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        const error = await response.json();
        alert('회원가입 실패: ' + (error.message || '알 수 없는 오류'));
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavigationBar />
      <form onSubmit={handleSubmit} style={{
        maxWidth: 500,
        margin: '60px auto 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
      }}>
        <h1 style={{ fontWeight: 600, fontSize: 40, marginBottom: 40 }}>회원가입</h1>
        {/* 이메일 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>이메일</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
        {/* 닉네임 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>닉네임</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
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
            {nickname && (
              <button type="button" onClick={() => setNickname('')} style={{
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
        {/* 비밀번호 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>비밀번호</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
        {/* 프로필 사진 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>프로필 사진</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: '100%',
              padding: '12px 0',
              fontSize: 16,
              border: 'none',
              background: '#fafafa',
              borderRadius: 10,
            }}
          />
          {profileImageUrl && (
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <img src={profileImageUrl} alt="프로필 미리보기" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} />
            </div>
          )}
        </div>
        {/* 소개글 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>소개글</label>
          <textarea
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              minHeight: 60,
              maxHeight: 200,
            }}
            required
          />
        </div>
        {/* 호스트 유무 토글 */}
        <div style={{ width: '100%', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ fontWeight: 600, fontSize: 20 }}>호스트 유무</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isHost}
              onChange={e => setIsHost(e.target.checked)}
              style={{ width: 24, height: 24 }}
            />
            <span style={{ fontSize: 18 }}>{isHost ? '호스트' : '일반'}</span>
          </label>
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
        }}>회원가입</button>
      </form>
    </div>
  );
};

export default SignUp; 