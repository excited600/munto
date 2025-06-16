import React from 'react';
import NavigationBar from './NavigationBar';
import TabMenu from './TabMenu';
import CardList from './CardList';

const Home: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <TabMenu />
      <CardList />
    </>
  );
};

export default Home; 