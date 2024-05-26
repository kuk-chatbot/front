export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  chatbot: { chatbot: '/chatbot' },
  motherboard: {
    overview: '/motherboard',
    account: '/motherboard/account',
    summary: '/motherboard/summary',
  },
} as const;
