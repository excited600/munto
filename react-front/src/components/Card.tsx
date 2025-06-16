import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  width: 282px;
  height: 327px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const CardImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 180px;
  background: url(${props => props.imageUrl}) center/cover no-repeat;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 16px 12px 16px;
`;

const CardCategory = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
  line-height: 1.3;
  word-break: keep-all;
`;

const CardDate = styled.div`
  font-size: 13px;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 달력 이모지 사용
const CalendarIcon = () => <span style={{fontSize: '15px'}}>📅</span>;

export interface CardProps {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
  date: string;
  price: number;
}

const Card: React.FC<CardProps> = (props) => {
  const navigate = useNavigate();
  const { id, imageUrl, category, title, date, price } = props;

  const handleClick = () => {
    navigate('/social-gathering-detail', { state: { ...props } });
  };

  return (
    <CardContainer onClick={handleClick}>
      <CardImage imageUrl={imageUrl} />
      <CardContent>
        <CardCategory>{category}</CardCategory>
        <CardTitle>{title}</CardTitle>
        <CardDate><CalendarIcon /> {date}</CardDate>
      </CardContent>
    </CardContainer>
  );
};

export default Card; 