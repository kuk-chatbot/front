'use client';

import * as React from 'react';
import { SendBirdProvider, ChannelList, Channel, ChannelSettings } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import useMessageHandler from '@/hooks/use-message-handler';

const APP_ID = 'YOUR_SENDBIRD_APP_ID'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'YOUR_USER_ID'; // Sendbird에 연결할 사용자 ID

export function ChatbotTable(): React.JSX.Element {
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState<string | null>(null);
  useMessageHandler(currentChannelUrl); // 커스텀 훅 사용

  return (
    <SendBirdProvider appId={APP_ID} userId={USER_ID}>
      <div className="channel-list">
        <ChannelList
          onChannelSelect={(channel) => {
            if (channel) {
              setCurrentChannelUrl(channel.url);
            }
          }}
          renderChannelPreview={({ channel }) => (
            <div key={channel.url} onClick={() => setCurrentChannelUrl(channel.url)}>
              {channel.name}
            </div>
          )}
        />
      </div>

      <div className="chat-container">
        {currentChannelUrl ? (
          <Channel channelUrl={currentChannelUrl} key={currentChannelUrl} />
        ) : (
          <div>Select a channel to start chatting</div>
        )}
      </div>
      <div className="channel-settings">
        {currentChannelUrl && <ChannelSettings channelUrl={currentChannelUrl} key={`settings-${currentChannelUrl}`} />}
      </div>
    </SendBirdProvider>
  );
}