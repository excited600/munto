import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';

const CardListWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const CardListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 20px;
  height: 36px;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const MoreButton = styled.button`
  color: #bbb;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
`;

const MoreText = styled.div`
  color: #bbb;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 36px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
`;

const RightArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L13 10L8 15" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LeftArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12 5L7 10L12 15" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 487px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  justify-content: center;
`;

interface ApiCard {
  id: number;
  name: string;
  thumbnail_url: string;
  location: string;
  start_datetime: string;
  price: number;
}

const CARDS_PER_PAGE = 4;

const CardList: React.FC = () => {
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_ENDPOINTS.SOCIAL_GATHERINGS.LATEST + '?count=10')
      .then(res => res.json())
      .then(data => setCards(data));
  }, []);

  const start = page * CARDS_PER_PAGE;
  const end = start + CARDS_PER_PAGE;
  const visibleCards = cards.slice(start, end);

  const handleNext = () => {
    if (end < cards.length) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const formatDate = (iso: string) => {
    return dayjs(iso).format('YYYY.M.D H:mm');
  };

  return (
    <CardListWrapper>
      <CardListHeader>
        {/* 왼쪽 끝 */}
        {page > 0 ? (
          <ArrowButton onClick={handlePrev}>
            <LeftArrowIcon />
          </ArrowButton>
        ) : (
          <div style={{ width: 36, height: 36 }} />
        )}

        {/* 오른쪽 끝 */}
        <RightGroup>
          <MoreButton onClick={() => navigate('/social-gatherings')}>더보기</MoreButton>
          {end < cards.length ? (
            <ArrowButton onClick={handleNext}>
              <RightArrowIcon />
            </ArrowButton>
          ) : (
            <div style={{ width: 36, height: 36 }} />
          )}
        </RightGroup>
      </CardListHeader>
      <CardListContainer>
        {visibleCards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            imageUrl={card.thumbnail_url}
            category={card.location}
            title={card.name}
            date={formatDate(card.start_datetime)}
            price={card.price}
          />
        ))}
      </CardListContainer>
    </CardListWrapper>
  );
};

export default CardList; 