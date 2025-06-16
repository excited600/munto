import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 28px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 20px;
`;

const TabItem = styled.div<{ active?: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  cursor: pointer;
`;

const TabMenu: React.FC = () => {
  return (
    <TabContainer>
      <TabItem active>추천</TabItem>
    </TabContainer>
  );
};

export default TabMenu; 