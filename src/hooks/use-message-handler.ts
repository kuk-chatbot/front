import { useEffect, useState } from 'react';
import axios from 'axios';
import SendBird from 'sendbird';

const APP_ID = '8AA2992B-477B-4759-A149-0B3C29BE23CF'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID
const CHATBOT_USER_ID = 'onboarding_bot'; // 챗봇의 사용자 ID
const CHANNEL_URL = 'sendbird_group_channel_188157088_9fe55984094ec88daed9a733148f55ab7e3fcb59'; // Sendbird 채널 URL

const useSendBird = () => {
  const [sendbirdInstance, setSendbirdInstance] = useState<SendBird.SendBirdInstance | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
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

  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(url);
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

        // 유저 메시지에서 modelName과 cause를 추출하는 로직 (가정)
        // 예를 들어, 메시지가 "모델명: ABC123, 증상: 팬 소음" 형식으로 되어 있다고 가정
        // if (userMessage) {
        //   console.log(userMessage);
        //   const parts = userMessage.split(',');
        //   if (parts) {
        //     const modelNamePart = parts.find((part) => part.trim().startsWith('모델명:'));
        //     const causePart = parts.find((part) => part.trim().startsWith('증상:'));
        //     if (modelNamePart) {
        //       setModelName(modelNamePart.split(':')[1].trim());
        //     }
        //     if (causePart) {
        //       setCause(causePart.split(':')[1].trim());
        //     }
        //   }
        // }
      } else if (message.messageType === 'file' && message.sender && message.sender.userId !== CHATBOT_USER_ID) {
        // 파일 메시지
        const fileMessage = message;
        console.log('Received file message:', fileMessage.url);
        try {
          const file = await urlToFile(fileMessage.url, 'image.jpg', 'image/jpeg');
          const data = new FormData();
          data.append('image', file);
          data.append('modelName', modelName ?? 'unknown');
          data.append('cause', cause ?? 'unknown');

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
              const answerMessage = `CPU Fan: ${answerData.cpuFan}, No Screws: ${answerData.cpuFanNoScrews}, Loose Screws: ${answerData.cpuFanScrewsLoose}`;
              setAnswer(answerMessage);
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

  // answer 데이터를 센드버드 챗봇 유저로 전송하는 코드
  // useEffect(() => {
  //   if (answer && sendbirdInstance) {
  //     sendbirdInstance.connect(CHATBOT_USER_ID, (error) => {
  //       if (error) {
  //         console.error('SendBird connection error for chatbot:', error);
  //         return;
  //       }
  //       sendbirdInstance.GroupChannel.getChannel(CHANNEL_URL, (channel, error) => {
  //         if (error) {
  //           console.error('Error getting channel:', error);
  //           return;
  //         }
  //         const params = new sendbirdInstance.UserMessageParams();
  //         params.message = answer;
  //         params.customType = 'user'; // 메시지 유형을 구분하기 위해 customType을 설정
  //         channel.sendUserMessage(params, (error) => {
  //           if (error) {
  //             console.error('Error sending message:', error);
  //             return;
  //           }
  //           console.log('Message sent:');
  //         });
  //       });
  //     });
  //   }
  // }, [answer, sendbirdInstance]);

  return { sendbirdInstance, answer, modelName, cause };
};

export default useSendBird;
