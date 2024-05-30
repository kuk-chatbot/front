// 'use client';

// import { useEffect, useState } from 'react';
// import * as React from 'react';
// import SendbirdChat from '@sendbird/chat';
// import { App as SendbirdApp, SendBirdProvider, useSendbirdStateContext } from '@sendbird/uikit-react';
// import Channel from '@sendbird/uikit-react/Channel';
// import ChannelList from '@sendbird/uikit-react/ChannelList';
// import ChannelSettings from '@sendbird/uikit-react/ChannelSettings';
// import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
// import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

// import '@sendbird/uikit-react/dist/index.css';

// import useMessageHandler from '@/hooks/use-message-handler';

// const APP_ID = '9042C609-8B21-4E14-862D-804753103B84'; // Sendbird Dashboard에서 생성한 앱 ID
// const USER_ID = 'klsj98101'; // Sendbird에 연결할 사용자 ID
// const NICKNAME = '승준'; // 사용자의 닉네임
// const PROFILE_URL = 'https://your-profile-url.com/profile.png'; // 사용자의 프로필 URL

// export function ChatbotTable(): React.JSX.Element {
//   const APP_ID = '9042C609-8B21-4E14-862D-804753103B84';
//   const userId = 'klsj98101';
//   const channelUrl = 'sendbird_group_channel_190139010_1a4a54b7edfe88be4130cf8ed21cb4ce7e8344d5';
//   useMessageHandler(channelUrl); // 커스텀 훅 사용
//   return (
//     <div className="app-container">
//       <div className="app-container">
//         <SendbirdProvider appId={APP_ID} userId={userId}>
//           {<GroupChannel channelUrl={channelUrl} />}
//         </SendbirdProvider>
//       </div>
//     </div>
//   );
// }
// export default ChatbotTable;
'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

import '@sendbird/uikit-react/dist/index.css';

import useSendBird from '@/hooks/use-message-handler';

const APP_ID = '8AA2992B-477B-4759-A149-0B3C29BE23CF'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID
const NICKNAME = '승준'; // 사용자의 닉네임
const PROFILE_URL = 'https://your-profile-url.com/profile.png'; // 사용자의 프로필 URL

export function ChatbotTable(): React.JSX.Element {
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const { sendbirdInstance, answer } = useSendBird();

  useEffect(() => {
    setChannelUrl('sendbird_group_channel_188157088_9fe55984094ec88daed9a733148f55ab7e3fcb59');
  }, []);
  // answer 데이터를 센드버드 챗봇 유저로 전송하는 코드
  // useEffect(() => {
  //   if (answer && sendbirdInstance && channelUrl) {
  //     sendbirdInstance.GroupChannel.getChannel(channelUrl, (channel, error) => {
  //       if (error) {
  //         console.error('Error getting channel:', error);
  //         return;
  //       }
  //       channel.sendUserMessage(answer, (error) => {
  //         if (error) {
  //           console.error('Error sending message:', error);
  //           return;
  //         }
  //         console.log('Message sent:');
  //       });
  //     });
  //   }
  // }, [answer, sendbirdInstance, channelUrl]);

  return (
    <div className="app-container">
      <SendbirdProvider appId={APP_ID} userId={USER_ID} nickname={NICKNAME} profileUrl={PROFILE_URL}>
        {channelUrl && <GroupChannel channelUrl={channelUrl} />}
      </SendbirdProvider>
    </div>
  );
}
export default ChatbotTable;
