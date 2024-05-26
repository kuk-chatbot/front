'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import '@sendbird/uikit-react/dist/index.css';

import { App as SendbirdApp, SendBirdProvider } from '@sendbird/uikit-react';
import Channel from '@sendbird/uikit-react/Channel';
import ChannelSettings from '@sendbird/uikit-react/Channel';
import ChannelList from '@sendbird/uikit-react/ChannelList';

import useMessageHandler from '@/hooks/use-message-handler';
import { useSelection } from '@/hooks/use-selection';

const APP_ID = '9042C609-8B21-4E14-862D-804753103B84'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID

// export function Chatbottable(): React.JSX.Element {
//   const [currentChannelUrl, setCurrentChannelUrl] = React.useState<string | null>(null);
//   useMessageHandler(currentChannelUrl); // 커스텀 훅 사용

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

      {/* <div className="chat-container">
          {currentChannelUrl ? (
            <Channel channelUrl={currentChannelUrl} key={currentChannelUrl} />
          ) : (
            <div>Select a channel to start chatting</div>
          )}
        </div> */}
      <div className="channel-settings">
        {currentChannelUrl && <ChannelSettings channelUrl={currentChannelUrl} key={`settings-${currentChannelUrl}`} />}
      </div>
    </SendBirdProvider>
  );
}
