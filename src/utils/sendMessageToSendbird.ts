import axios from 'axios';

const APP_ID = '9042C609-8B21-4E14-862D-804753103B84'; // Sendbird Dashboard에서 생성한 앱 ID
const API_TOKEN = 'YOUR_API_TOKEN'; // Sendbird API 토큰

export async function sendMessageToSendbird(channelType: string, channelUrl: string, userId: string, message: string) {
  const url = `https://api-${APP_ID}.sendbird.com/v3/${channelType}/${channelUrl}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        message_type: 'MESG',
        user_id: userId,
        message: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': API_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to send message to Sendbird:', error);
    throw error;
  }
}