export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  motherboard: {
    overview: '/motherboard',
    account: '/motherboard/account',
    summary: '/motherboard/summary',
    chatbot: '/motherboard/chatbot',
    settings: '/motherboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
