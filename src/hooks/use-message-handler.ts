import { useEffect, useState } from 'react';
import axios from 'axios';
import SendBird, { FileMessage, GroupChannel, SendBirdInstance, UserMessageParams } from 'sendbird';

const APP_ID = '8AA2992B-477B-4759-A149-0B3C29BE23CF'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID
const CHATBOT_USER_ID = 'onboarding_bot'; // 챗봇의 사용자 ID

interface Answer {
  message: string;
  resultImage: string;
}

const useSendBird = () => {
  const [sendbirdInstance, setSendbirdInstance] = useState<SendBird.SendBirdInstance | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [cause, setCause] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');

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
    `http://kuk.solution:8000/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase();
  };

  const getMimeType = (extension: string) => {
    switch (extension) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'image/jpeg'; // 기본 MIME 타입
    }
  };

  const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(proxyImageUrl(url));
    const blob = await response.blob();

    const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg'; // URL에서 파일 이름 추출
    const fileExtension = getFileExtension(fileName);
    const mimeType = getMimeType(fileExtension || '');

    return new File([blob], fileName, { type: mimeType });
  };

  useEffect(() => {
    if (!sendbirdInstance) return;

    const channelHandlerId = 'UNIQUE_HANDLER_ID';
    const ChannelHandler = new sendbirdInstance.ChannelHandler();

    ChannelHandler.onMessageReceived = async (channel, message) => {
      if (message.messageType === 'user' && message.sender && message.sender.userId !== CHATBOT_USER_ID) {
        const userMessage = message.message;
        console.log('Received text message:', userMessage);
        // "증상 ~" 또는 "모델명 ~" 패턴을 찾음
        const causeMatch = userMessage?.match(/증상:\s*([^,]+)/);
        const modelNameMatch = userMessage?.match(/모델명:\s*([^,]+)/);

        if (causeMatch) {
          console.log(causeMatch);
          setCause(causeMatch[1].trim());
        }
        if (modelNameMatch) {
          console.log(modelName);
          setModelName(modelNameMatch[1].trim());
        }
      } else if (message.messageType === 'file' && message.sender && message.sender.userId !== CHATBOT_USER_ID) {
        // 파일 메시지
        const fileMessage = message;
        console.log('Received file message:', fileMessage.url);
        try {
          setLoading(true); // 로딩 시작
          const startTime = Date.now(); // 시작 시간 기록
          const file = await urlToFile(fileMessage.url);
          console.log(file);
          const data = new FormData();
          data.append('image', file);
          data.append('modelName', modelName ?? 'dafault');
          data.append('cause', cause ?? 'default');

          // 데이터 확인
          console.log(data);
          data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });

          const jwtToken = localStorage.getItem('custom-auth-token'); // 로컬 스토리지에서 JWT 토큰 가져오기

          axios
            .post('http://kuk.solution:8000/motherboard/upload', data, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              const answerData = response.data;
              // answerData 객체를 문자열로 변환하여 Sendbird 메시지로 설정
              setAnswer({
                message: `CPU Fan No Screws: ${answerData.cpuFanNoScrews || 0}<br> 
                CPU Fan Port Detached: ${answerData.cpuFanPortDetached || 0}<br> 
                CPU Fan Screws Loose: ${answerData.cpuFanScrewsLoose || 0}<br> 
                Incorrect Screws: ${answerData.incorrectScrews || 0}<br> 
                Loose Screws: ${answerData.looseScrews || 0}<br> 
                No Screws: ${answerData.noScrews || 0}<br> 
                Scratch: ${answerData.scratch || 0}<br>`,
                resultImage: `data:image/jpeg;base64,${answerData.resultImage}`, // Ensure it's base64 encoded
              });
              const elapsedTime = Date.now() - startTime;
              const remainingTime = Math.max(3000 - elapsedTime, 0); // 최소 3초 보장
              setTimeout(() => {
                setLoading(false); // 로딩 종료
              }, remainingTime);
            })
            .catch((error) => {
              console.error('Error sending file to server:', error);
              setLoading(false); // 로딩 종료
            });
        } catch (error) {
          console.error('Error converting URL to file:', error);
          setLoading(false); // 로딩 종료
        }
      }
    };

    sendbirdInstance.addChannelHandler(channelHandlerId, ChannelHandler);

    return () => {
      sendbirdInstance.removeChannelHandler(channelHandlerId);
    };
  }, [sendbirdInstance, modelName, cause]);

  return { sendbirdInstance, answer, modelName, cause, loading, result, resultImage, setResult, setResultImage };
};

export default useSendBird;
