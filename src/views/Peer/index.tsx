import React, {useCallback, useEffect, useRef, useState} from 'react';

import {useAntMedia} from 'rn-antmedia';

import InCallManager from 'react-native-incall-manager';

import {
  Container,
  Input,
  Label,
  Text,
  Button,
  InputView,
  LocalView,
  RemoteView,
} from './styles';

const defaultStreamName = '404586605228978056757958';

type fn = () => void;
const urlf  = 'wss://allpoker.antm2.otoserver.xyz:5443/webAPP/websocket'
const Peer: React.FC = () => {
  const [localMedia, setLocalMedia] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>('');
  const events = useRef<{
    [key: string]: fn;
  }>({});
  const adaptor = useAntMedia({
    url: urlf,
    // url: 'ws://server.com:5080/WebRTCAppEE/websocket',
    mediaConstraints: {
      video: {
        mandatory: {
          minFrameRate: 30,
          minHeight: 480,
          minWidth: 640,
        },
        optional: [],
        facingMode: 'user',
      },
      audio: true,
    },
    sdp_constraints: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    },
    // bandwidth: 300,
    // peerconnection_config: {
    //   iceServers: [
    //     {
    //       url: 'stun:stun.l.google.com:19302',
    //     },
    //   ],
    // },
    // callback(command, data) {
    //   switch (command) {
    //     case 'pong':
    //       console.log("---Callback -pong---")
    //       break;
    //     case 'joined':

    //       console.log("---Callback -joined---")
    //       setIsPlaying(true);
    //       break;
    //     default:

    //       console.log("---Callback -default---")
    //       break;
    //   }
    // },
    // callbackError: (err, data) => {

    //   console.log("---Callback -Error ---")
    //   console.error('callbackError', err, data);
    // },

  });
  console.log("adaptor",adaptor)
  const handleSetStreamName = useCallback((value) => {

    console.log("---method ---")
    streamNameRef.current = value || '';
  }, []);

  const handleLeave = useCallback(() => {

    console.log("---method ---")
    if (!adaptor) {
      return;
    }
    adaptor.leave(streamNameRef.current);
    InCallManager.stop();
    setIsPlaying(false);
  }, [adaptor]);

  useEffect(() => {

    console.log("---useEffect 1---")
    events.current.handleLeave = handleLeave;

    console.log("---useEffect 11---")
  }, [handleLeave]);

  useEffect(() => {

    console.log("---useEffect 2---")
    const toLeave = events.current.handleLeave;

    console.log("---useEffect 21---")
    

    return () => {

    console.log("---useEffect 22---")
      console.log(streamNameRef.current)
      if (streamNameRef.current) {
      
      console.log("---useEffect 23---")
        toLeave();
      }
    };
  }, []);

  const handleJoin = useCallback(() => {

    console.log("---useEffect ---")
    if (!adaptor || !streamNameRef.current) {
      return;
    }
    adaptor.join(streamNameRef.current);
  }, [adaptor]);

  useEffect(() => {

    console.log("---useEffect 3---")
    console.log(adaptor)
    if (adaptor) {

      console.log("---useEffect 31---")
      const verify = () => {
        if (

          adaptor.localStream.current &&
          adaptor.localStream.current.toURL()
        ) {

          console.log("---useEffect 32---")
          return setLocalMedia(adaptor.localStream.current.toURL());

        }
        setTimeout(verify, 3000);
      };
      verify();
    }
  }, [adaptor]);

  useEffect(() => {

    console.log("---useEffect 4---")
    if (localMedia && remoteMedia) {
      InCallManager.start({media: 'video'});

      console.log("---useEffect 41---")
    }
  }, [localMedia, remoteMedia]);

  useEffect(() => {

    console.log("---useEffect 5---")
    if (adaptor && Object.keys(adaptor.remoteStreams).length > 0) {

      console.log("---useEffect 51---")
      for (let i in adaptor.remoteStreams) {
        let st =
          adaptor.remoteStreams[i] && 'toURL' in adaptor.remoteStreams[i]
            ? adaptor.remoteStreams[i].toURL()
            : null;
        setRemoteStream(st || '');

        console.log("---useEffect 52---")
        break;
      }
    }
  }, [adaptor]);

  return (
    <Container is-playing={isPlaying}>
      {!isPlaying ? (
        <>
          <InputView>
            <Label children="Stream Name" />
            <Input
              defaultValue={defaultStreamName}
              onChangeText={handleSetStreamName}
            />
          </InputView>
          <Button onPress={handleJoin}>
            <Text>Play</Text>
          </Button>
        </>
      ) : (
        <>
          <RemoteView zOrder={1} objectFit="cover" streamURL={remoteMedia} />
          <LocalView zOrder={2} objectFit="cover" streamURL={localMedia} />
          <Button style={{marginTop: 'auto'}} onPress={handleLeave}>
            <Text>Stop</Text>
          </Button>
        </>
      )}
    </Container>
  );
};

export default Peer;
