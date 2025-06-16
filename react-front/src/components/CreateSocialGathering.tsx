import React, { useState, ChangeEvent } from 'react';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_ENDPOINTS } from '../api/config';

const CreateSocialGathering: React.FC = () => {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert('로그인 하세요');
      navigate('/login');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('price', price);
    formData.append('location', location);
    formData.append('start_datetime', new Date(startTime).toISOString());
    formData.append('end_datetime', new Date(endTime).toISOString());

    try {
      const response = await fetch(API_ENDPOINTS.SOCIAL_GATHERINGS.CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('소셜링을 성공적으로 열었습니다');
        navigate('/');
      } else {
        alert('소셜링을 열지 못했습니다');
      }
    } catch (error) {
      alert('소셜링을 열지 못했습니다');
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
        
        {/* 소셜링 이름 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>소셜링 이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
        {/* 썸네일 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>썸네일</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
        {/* 가격 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>가격</label>
          <input
            type="text"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
        {/* 위치 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>위치</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
        {/* 시작 시간 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>시작 시간</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
        {/* 끝 시간 */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, display: 'block' }}>끝 시간</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 18,
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required
          />
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
        }}>소셜링 열기</button>
      </form>
    </div>
  );
};

export default CreateSocialGathering; 