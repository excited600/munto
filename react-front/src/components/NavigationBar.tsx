import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const NavContainer = styled.nav`
  width: 100%;
  max-width: 1200px;
  height: 107px;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #222;
  letter-spacing: 1px;
  cursor: pointer;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavItem = styled.div<{ active?: boolean }>`
  font-size: 24px;
  font-weight: ${props => props.active ? 700 : 500};
  color: ${props => props.active ? '#222' : '#bbb'};
  cursor: pointer;
  transition: color 0.2s;
`;

const RightSection = styled.div`
  margin-left: auto;
`;

const OpenButton = styled.button`
  background: #ff3b30;
  border: none;
  font-size: 18px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  margin-right: 12px;
  transition: background 0.2s;
  &:hover {
    background: #ff6659;
  }
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #222;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleOpenClick = () => {
    if (accessToken) {
      // 로그인된 경우 소셜 모임 생성 페이지로 이동
      navigate('/create-social-gathering');
    } else {
      // 로그인되지 않은 경우 알림 후 로그인 페이지로 이동
      alert('로그인 하세요');
      navigate('/login');
    }
  };

  return (
    <NavContainer>
      <LeftSection>
        <Logo onClick={() => navigate('/')}>MUNTO</Logo>
        <NavMenu>
          <NavItem active onClick={() => navigate('/')}>모임</NavItem>
        </NavMenu>
      </LeftSection>
      <RightSection>
        <OpenButton onClick={handleOpenClick}>+ 열기</OpenButton>
        <LoginButton onClick={() => navigate('/login')}>로그인</LoginButton>
      </RightSection>
    </NavContainer>
  );
};

export default NavigationBar; 