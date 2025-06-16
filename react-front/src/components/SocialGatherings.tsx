import React, { useEffect, useState, useRef, useCallback } from 'react';
import NavigationBar from './NavigationBar';
import Card from './Card';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { API_ENDPOINTS } from '../api/config';

const CardGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

interface ApiCard {
  id: number;
  name: string;
  thumbnail_url: string;
  location: string;
  start_datetime: string;
  price: number;
}

const formatDate = (iso: string) => dayjs(iso).format('YYYY.M.D H:mm');

const SocialGatherings: React.FC = () => {
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCardElementRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const url = cursor
      ? `${API_ENDPOINTS.SOCIAL_GATHERINGS.SCROLL}?cursor=${cursor}`
      : API_ENDPOINTS.SOCIAL_GATHERINGS.SCROLL;
    const res = await fetch(url);
    const data: ApiCard[] = await res.json();
    setCards(prev => [...prev, ...data]);
    setHasMore(data.length > 0);
    if (data.length > 0) {
      setCursor(data[data.length - 1].id);
    }
    setLoading(false);
  }, [cursor, loading, hasMore]);

  // 최초 1회 fetch
  useEffect(() => {
    fetchMore();
    // eslint-disable-next-line
  }, []);

  // IntersectionObserver 등록 (cursor가 있을 때만)
  useEffect(() => {
    if (!hasMore || loading || cards.length === 0 || cursor === undefined) {
      return;
    }

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMore();

      }
    });

    if (lastCardElementRef.current) {
      observer.current.observe(lastCardElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [cards, hasMore, loading, fetchMore, cursor]);

  return (
    <div>
      <NavigationBar />
      <CardGrid>
        {cards.map((card, idx) => {
          if (idx === cards.length - 1) {
            return (
              <div ref={lastCardElementRef} key={card.id}>
                <Card
                  id={card.id}
                  imageUrl={card.thumbnail_url}
                  category={card.location}
                  title={card.name}
                  date={formatDate(card.start_datetime)}
                  price={card.price}
                />
              </div>
            );
          }
          return (
            <Card
              key={card.id}
              id={card.id}
              imageUrl={card.thumbnail_url}
              category={card.location}
              title={card.name}
              date={formatDate(card.start_datetime)}
              price={card.price}
            />
          );
        })}
      </CardGrid>
      {loading && <div style={{ textAlign: 'center', margin: '40px 0' }}>불러오는 중...</div>}
    </div>
  );
};

export default SocialGatherings;
