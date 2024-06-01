import { useEffect, useState } from 'react';
import SendBird from 'sendbird';

const APP_ID = '9042C609-8B21-4E14-862D-804753103B84'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID

const useSendBird = (currentChannelUrl: string | null) => {
  const [sendbirdInstance, setSendbirdInstance] = useState<SendBird.SendBirdInstance | null>(null);

  useEffect(() => {
    const sb = new SendBird({ appId: APP_ID });
    sb.connect(USER_ID, (user, error) => {
      if (error) {
        console.error('SendBird connection error:', error);
        return;
      }
      setSendbirdInstance(sb);
    });
  }, []);

  useEffect(() => {
    if (!sendbirdInstance || !currentChannelUrl) return;

    const channelHandlerId = 'UNIQUE_HANDLER_ID';
    const ChannelHandler = new sendbirdInstance.ChannelHandler();

    ChannelHandler.onMessageReceived = (channel, message) => {
      if (message.isFileMessage()) {
        console.log('Received file message:', message.url);
      } else {
        console.log('Received text message:', message.message);
      }
    };

    sendbirdInstance.addChannelHandler(channelHandlerId, ChannelHandler);

    // Cleanup function
    return () => {
      sendbirdInstance.removeChannelHandler(channelHandlerId);
    };
  }, [sendbirdInstance, currentChannelUrl]);

  return sendbirdInstance;
};

export default useSendBird;