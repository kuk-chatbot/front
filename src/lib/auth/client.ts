'use client';

import type { User } from '@/types/user';

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
//   role: 'personal',
// } satisfies User;

export interface SignUpParams {
  username: string;
  name: string;
  password: string;
  role: string;
  userlimit?: number;
  memory?: number;
  cores?: number;
  sockets?: number;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

// export interface ResetPasswordParams {
//   email: string;
// }

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await fetch('http://localhost:8000/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });


      if (!response.ok) {
        const errorData: unknown = await response.json();
        if (this.isErrorResponse(errorData)) {
          return { error: errorData.message || 'Something went wrong' };
        }
        return { error: 'Something went wrong' };
      }

      //responseData에 {"status":200,"data":1}
      const responseData: unknown = await response.json();
      if (this.isAuthResponse(responseData)) {
        
        localStorage.setItem('custom-auth-token', responseData.token);
      }

      


      return {};
    } catch (error) {

      
      return { error: 'Network error' };
    }
  }

  private isErrorResponse(data: unknown): data is { message: string } {
    return typeof data === 'object' && data !== null && 'message' in data;
  }

  private isAuthResponse(data: unknown): data is { token: string } {
    return typeof data === 'object' && data !== null && 'token' in data;
  }

  // async signInWithOAuth(params: SignInWithOAuthParams): Promise<{ error?: string }> {
  //   return { error: 'Social authentication not implemented' };
  // }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    // const { username, password } = params;

    try {
      
      
      const { username, password } = params;
      
      // role을 제외한 새로운 객체를 만듭니다.
      const filteredParams = { username, password };
      
      
      const response = await fetch('http://localhost:8000/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredParams),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        if (this.isErrorResponse(errorData)) {
          return { error: errorData.message || 'Invalid credentials' };
        }
        return { error: 'Invalid credentials' };
      }
      

      const responseData: unknown = await response.json();
      if (this.isAuthResponse(responseData)) {
        localStorage.setItem('custom-auth-token', responseData.token);
      }
  

      return {};
    } catch (error) {

      
      return { error: 'Network error' };
    }
  }

  // async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Password reset not implemented' };
  // }

  // async updatePassword(params: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Update reset not implemented' };
  // }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await fetch('/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { data: null };
      }

      const userData = await response.json();
      return { data: userData };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
