'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';
import { ChannelSettings, App as SendbirdApp } from '@sendbird/uikit-react';
import { GroupChannel, GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

import AnalysisResult from './AnalysisResult';
import LoadingDialog from './LoadingDialog';

import '@sendbird/uikit-react/dist/index.css';

import useSendBird from '@/hooks/use-message-handler';

const APP_ID = '8AA2992B-477B-4759-A149-0B3C29BE23CF'; // Sendbird Dashboard에서 생성한 앱 ID
const USER_ID = 'klsj9810'; // Sendbird에 연결할 사용자 ID

export function ChatbotTable(): React.JSX.Element {
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const { sendbirdInstance, answer, loading, result, resultImage, setResult, setResultImage } = useSendBird();

  useEffect(() => {
    setChannelUrl('sendbird_group_channel_188157088_9fe55984094ec88daed9a733148f55ab7e3fcb59');
  }, []);

  // useEffect(() => {
  //   if (answer) {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //       setResult(answer.message);
  //       setResultImage('data:image/jpeg;base64,' + btoa(answer.resultImage)); // assuming answer.resultImage contains the image in base64
  //     }, 5000);
  //   }
  // }, [answer]);

  const handleResultClose = () => {
    setResult('');
    setResultImage('');
  };
  return (
    <div>
      <SendbirdApp appId={APP_ID} userId={USER_ID} />
      <LoadingDialog open={loading} />
      <AnalysisResult open={Boolean(result)} onClose={handleResultClose} result={result} resultImage={resultImage} />
    </div>
  );
}
export default ChatbotTable;
