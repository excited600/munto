import React, { useEffect, useState } from 'react';
import NavigationBar from './NavigationBar';

const Payment: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
      console.log('iamport 스크립트 로드 성공');
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

  const requestPay = () => {
    // @ts-ignore
    const { IMP } = window;
    console.log('window.IMP:', IMP);
    if (!IMP) {
      alert('결제 모듈이 아직 로드되지 않았습니다.');
      return;
    }
    IMP.init('imp17383754');
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: 'order_no_' + new Date().getTime(),
        name: '테스트 상품',
        amount: 1000,
        buyer_email: 'test@naver.com',
        buyer_name: '홍길동',
      },
      function (rsp: any) {
        if (rsp.success) {
          // 결제 성공
          console.log('결제 성공', rsp);
        } else {
          // 결제 실패
          alert('결제에 실패하였습니다: ' + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
        <button
          onClick={requestPay}
          disabled={!isLoaded}
          style={{
            padding: '16px 32px',
            fontSize: '18px',
            background: '#fee500',
            color: '#191919',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoaded ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          {isLoaded ? '카카오페이 테스트 결제' : '결제 모듈 로딩 중...'}
        </button>
      </div>
    </div>
  );
};

export default Payment; 