import React from 'react';
import styled from 'styled-components';
import Home from './components/Home';
import SocialGatherings from './components/SocialGatherings';
import SocialGatheringDetail from './components/SocialGatheringDetail';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import CreateSocialGathering from './components/CreateSocialGathering';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #fff;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/social-gatherings" element={<SocialGatherings />} />
          <Route path="/social-gathering-detail/:id" element={<SocialGatheringDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-social-gathering" element={<CreateSocialGathering />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
