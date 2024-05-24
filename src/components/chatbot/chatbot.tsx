import SendBird from 'sendbird';


const sb = new SendBird({ appId: '9042C609-8B21-4E14-862D-804753103B84' });

sb.connect('USER_ID', 'ACCESS_TOKEN', (user, error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Connected to Sendbird!');
  }
});
