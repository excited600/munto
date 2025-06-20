import React, { useEffect, useState } from 'react';
import NavigationBar from './NavigationBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_ENDPOINTS } from '../api/config';
import dayjs from 'dayjs';

const DetailWrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto 0 auto;
  display: flex;
  gap: 32px;
  align-items: flex-start;
`;

const ImageSection = styled.div`
  flex: 1.5;
  min-width: 0;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 320px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px 32px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubInfo = styled.div`
  color: #888;
  font-size: 15px;
  margin-bottom: 8px;
`;

const DateInfo = styled.div`
  color: #888;
  font-size: 15px;
  margin-bottom: 16px;
`;

const PriceLabel = styled.div`
  color: #bbb;
  font-size: 15px;
  margin-bottom: 4px;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 24px;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background: #fee500;
  color: #191919;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const HostButton = styled.div`
  width: 100%;
  padding: 16px 0;
  background: #ff3b30;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
`;

// 멤버 소개 섹션 스타일
const MemberSection = styled.div`
  max-width: 1200px;
  margin: 64px auto 0 auto;
`;

const MemberTitle = styled.div`
  color: #ff3b30;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const MemberSubTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 32px;
`;

const MemberList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const MemberCard = styled.div`
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const MemberName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #222;
`;

const MemberComment = styled.div`
  font-size: 16px;
  color: #444;
`;

const GrayCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e0e0e0;
`;

// API 응답 형식에 맞는 인터페이스 정의
interface SocialGatheringData {
  id: number;
  host_uuid: string;
  name: string;
  location: string;
  thumbnail_url: string;
  price: number;
  view_count: number;
  start_datetime: string;
  end_datetime: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  requestorIsHost: boolean;
}

const SocialGatheringDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const card = location.state as {
    imageUrl: string;
    category: string;
    title: string;
    date: string;
    id: number;
    price: number;
  };

  // URL 파라미터에서 id 가져오기
  const gatheringId = params.id ? parseInt(params.id) : card?.id;

  const [isLoaded, setIsLoaded] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [gatheringData, setGatheringData] = useState<SocialGatheringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const loginedEmail = useSelector((state: RootState) => state.auth.email);

  // API에서 소셜 모임 데이터 가져오기
  useEffect(() => {
    if (!gatheringId) {
      setError('유효하지 않은 모임 ID입니다.');
      setLoading(false);
      return;
    }

    const fetchGatheringData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.SOCIAL_GATHERINGS.GET_BY_ID(gatheringId), {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('모임 정보를 가져올 수 없습니다.');
        }
        
        const data: SocialGatheringData = await response.json();
        setGatheringData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGatheringData();
  }, [gatheringId, accessToken]);

  useEffect(() => {
    // jQuery 먼저 로드
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    jqueryScript.async = true;
    document.body.appendChild(jqueryScript);

    // iamport 스크립트 로드
    const iamportScript = document.createElement('script');
    iamportScript.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';
    iamportScript.async = true;
    document.body.appendChild(iamportScript);

    iamportScript.onload = () => {
      setIsLoaded(true);
    };
    iamportScript.onerror = () => {
      console.error('iamport 스크립트 로드 실패');
    };

    return () => {
      document.body.removeChild(jqueryScript);
      document.body.removeChild(iamportScript);
    };
  }, []);

  // 참가자 목록 가져오기 함수
  const fetchParticipants = async () => {
    if (!gatheringData) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.SOCIAL_GATHERINGS.PARTICIPANTS(gatheringData.id), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('참가자 정보를 가져오는데 실패했습니다:', err);
    }
  };

  useEffect(() => {
    // 참가자 정보 fetch
    if (gatheringData) {
      fetchParticipants();
    }
  }, [gatheringData]);

  const requestPay = () => {
    if (!accessToken) {
      alert('로그인하세요');
      navigate('/login');
      return;
    }

    if (!gatheringData) {
      alert('모임 정보를 불러올 수 없습니다.');
      return;
    }

    // @ts-ignore
    const { IMP } = window;
    if (!IMP) {
      alert('결제 모듈이 아직 로드되지 않았습니다.');
      return;
    }
    IMP.init('imp17383754');
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: String(gatheringData.id) + '-' + loginedEmail,
        name: gatheringData.name,
        amount: gatheringData.price,
        buyer_email: loginedEmail,
      },
      async function (rsp: any) {
        if (rsp.success) {
          // 결제 성공
          try {
            const response = await fetch(API_ENDPOINTS.SOCIAL_GATHERINGS.PARTICIPATE(gatheringData.id), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ imp_uid: rsp.imp_uid }),
            });
    
            if (response.ok) {
              alert('참가 신청이 완료되었습니다!');
              // 참가자 목록 새로고침
              fetchParticipants();
            } else {
              const error = await response.json();
              alert('참가 신청 실패: ' + (error.message || '알 수 없는 오류'));
              // 실패해도 참가자 목록 새로고침 (다른 사용자가 참가했을 수 있음)
              fetchParticipants();
            }
          } catch (err) {
            alert('네트워크 오류가 발생했습니다.');
            // 에러가 발생해도 참가자 목록 새로고침
            fetchParticipants();
          }
        } else {
          // 결제 실패
          alert('결제에 실패하였습니다: ' + rsp.error_msg);
          // 결제 실패해도 참가자 목록 새로고침
          fetchParticipants();
        }
      }
    );
  };

  return (
    <div>
      <NavigationBar />
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          fontSize: '18px', 
          color: '#666' 
        }}>
          모임 정보를 불러오는 중...
        </div>
      )}
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          fontSize: '18px', 
          color: '#ff3b30' 
        }}>
          {error}
        </div>
      )}
      {!loading && !error && gatheringData && (
        <>
          <DetailWrapper>
            <ImageSection>
              <MainImage src={gatheringData.thumbnail_url} alt={gatheringData.name} />
            </ImageSection>
            <InfoSection>
              <Title>{gatheringData.name}</Title>
              <SubInfo>{gatheringData.location}</SubInfo>
              <DateInfo>{dayjs(gatheringData.start_datetime).format('YYYY-MM-DD HH:mm')}</DateInfo>
              <PriceLabel>참가비</PriceLabel>
              <Price>{gatheringData.price.toLocaleString()}원</Price>
              {gatheringData.requestorIsHost ? (
                <HostButton>호스트입니다</HostButton>
              ) : (
                <PayButton onClick={requestPay} disabled={!isLoaded}>
                  {isLoaded ? '카카오페이 테스트 결제' : '결제 모듈 로딩 중...'}
                </PayButton>
              )}
            </InfoSection>
          </DetailWrapper>
          <MemberSection>
            <MemberTitle>멤버소개</MemberTitle>
            <MemberSubTitle>함께하는 멤버들을 알려드릴게요</MemberSubTitle>
            {members.length === 0 ? (
              <div style={{ color: '#888', fontSize: '18px', margin: '32px 0' }}>현재 멤버가 모이지 않았어요</div>
            ) : (
              <MemberList>
                {members.map((member, idx) => (
                  <MemberCard key={member.user_uuid || idx}>
                    <ProfileRow>
                      {member.profile_picture_url ? (
                        <ProfileImg src={member.profile_picture_url} alt={member.name} />
                      ) : (
                        <GrayCircle />
                      )}
                      <MemberName>{member.name}</MemberName>
                    </ProfileRow>
                    {member.introduction && (
                      <MemberComment>{member.introduction}</MemberComment>
                    )}
                  </MemberCard>
                ))}
              </MemberList>
            )}
          </MemberSection>
        </>
      )}
    </div>
  );
};

export default SocialGatheringDetail; 