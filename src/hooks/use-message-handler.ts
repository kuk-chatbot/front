import { useEffect, useState } from 'react';
import axios from 'axios';
import SendBird, { FileMessage, GroupChannel, SendBirdInstance, UserMessageParams } from 'sendbird';

const APP_ID = '8AA2992B-477B-4759-A149-0B3C29BE23CF'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID
const CHATBOT_USER_ID = 'onboarding_bot'; // 챗봇의 사용자 ID
const CHANNEL_URL = 'sendbird_group_channel_188157088_0a3cf77688448e08453cbbb1be98b3de1a6a7853'; // Sendbird 채널 URL

interface Answer {
  message: string;
  resultImage: string;
}

const useSendBird = () => {
  const [sendbirdInstance, setSendbirdInstance] = useState<SendBird.SendBirdInstance | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [cause, setCause] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem('custom-auth-token'); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }

    const sb = new SendBird({ appId: APP_ID });
    sb.connect(USER_ID, (user, error) => {
      if (error) {
        console.error('SendBird connection error:', error);
        return;
      }
      console.log('SendBird connection successful:', user);
      setSendbirdInstance(sb);
    });
  }, []);

  const proxyImageUrl = (imageUrl: string) =>
    `http://localhost:8000/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(proxyImageUrl(url));
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  useEffect(() => {
    if (!sendbirdInstance) return;

    const channelHandlerId = 'UNIQUE_HANDLER_ID';
    const ChannelHandler = new sendbirdInstance.ChannelHandler();

    ChannelHandler.onMessageReceived = async (channel, message) => {
      if (message.messageType === 'user' && message.sender && message.sender.userId !== CHATBOT_USER_ID) {
        const userMessage = message.message;
        console.log('Received text message:', userMessage);
      } else if (message.messageType === 'file' && message.sender && message.sender.userId !== CHATBOT_USER_ID) {
        // 파일 메시지
        const fileMessage = message;
        console.log('Received file message:', fileMessage.url);
        try {
          const file = await urlToFile(fileMessage.url, 'image.jpg', 'image/jpeg');
          const data = new FormData();
          data.append('image', file);
          data.append('modelName', modelName ?? 'KUK001');
          data.append('cause', cause ?? '컴퓨터가 안켜져요');

          // 데이터 확인
          data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });

          const jwtToken = localStorage.getItem('custom-auth-token'); // 로컬 스토리지에서 JWT 토큰 가져오기

          axios
            .post('http://localhost:8000/motherboard/upload', data, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              const answerData = response.data;
              // answerData 객체를 문자열로 변환하여 Sendbird 메시지로 설정
              setAnswer({
                message: `CPU Fan: 1, No Screws: 2, Loose Screws: 3`,
                resultImage: 'https://cdn-icons-png.flaticon.com/128/8943/8943377.png', // assuming resultImage is part of the response data
              });
              // 위 코드는 하드 코딩된 코드입니다. 아래를 사용해주세요.
              // setAnswer({
              //   message: `CPU Fan: ${answerData.cpuFan}, No Screws: ${answerData.cpuFanNoScrews}, Loose Screws: ${answerData.cpuFanScrewsLoose}`,
              //   resultImage: answerData.resultImage, // assuming resultImage is part of the response data
              // });
            })
            .catch((error) => {
              console.error('Error sending file to server:', error);
            });
        } catch (error) {
          console.error('Error converting URL to file:', error);
        }
      }
    };

    sendbirdInstance.addChannelHandler(channelHandlerId, ChannelHandler);

    return () => {
      sendbirdInstance.removeChannelHandler(channelHandlerId);
    };
  }, [sendbirdInstance, modelName, cause]);

  return { sendbirdInstance, answer, modelName, cause };
};

export default useSendBird;
