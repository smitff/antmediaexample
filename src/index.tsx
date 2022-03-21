import React from 'react';
import {NativeRouter, Route, Routes} from 'react-router-native';
import styled from 'styled-components/native';

import Room from './views/Room';
import Peer from './views/Peer';
import Chat from './views/Chat';

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const src: React.FC = () => {
  return (
    <SafeArea>
      <NativeRouter>
        <Container>
          <Routes>
            <Route path="/" element={<Peer/>} />
            {/* <Route path="/" element={<Chat/>} /> */}
          </Routes>
        </Container>
      </NativeRouter>
    </SafeArea>
  );
};

export default src;