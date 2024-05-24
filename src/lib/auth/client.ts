'use client';

import type { User } from '@/types/user';
import axios from 'axios';

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

class AuthClient {
  constructor() {
    // Axios 인터셉터 설정
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // 토큰이 유효하지 않음
          this.signOut();
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
      }
    );
  }

  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      // params 가공
      const filteredParams = this.filterSignUpParams(params);
  
      const response = await axios.post('http://localhost:8000/auth/sign-up', filteredParams, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        const errorData = response.data;
        if (this.isErrorResponse(errorData)) {
          return { error: errorData.message || 'Something went wrong' };
        }
        return { error: 'Something went wrong' };
      }
  
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Network error' };
    }
  }
  
  // SIGNUP 파라미터 필터링 메서드
  private filterSignUpParams(params: SignUpParams): Partial<SignUpParams> {
    const { role, username, name, password, userlimit, memory, cores, sockets } = params;
    const filteredParams: Partial<SignUpParams> = { role, username, name, password };
  
    if (role !== 'PERSONAL') {
      if (userlimit !== 0) filteredParams.userlimit = userlimit;
      if (memory !== 0) filteredParams.memory = memory;
      if (cores !== 0) filteredParams.cores = cores;
      if (sockets !== 0) filteredParams.sockets = sockets;
    }
  
    return filteredParams;
  }

  private isErrorResponse(data: unknown): data is { message: string } {
    return typeof data === 'object' && data !== null && 'message' in data;
  }

  private isAuthResponse(data: unknown): data is { jwtToken: string } {
    return typeof data === 'object' && data !== null && 'jwtToken' in data;
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post('http://localhost:8000/auth/sign-in', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const errorData = response.data;
        if (this.isErrorResponse(errorData)) {
          return { error: errorData.message || 'Invalid credentials' };
        }
        return { error: 'Invalid credentials' };
      }

      const responseData = response.data;
      if (this.isAuthResponse(responseData)) {
        localStorage.setItem('custom-auth-token', responseData.jwtToken);
        window.location.href = '/dashboard';
      }

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Network error' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await axios.get('http://localhost:8000/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        return { data: null };
      }

      const userData = response.data;
      return { data: userData };
    } catch (error) {
      console.error('Get user error:', error);
      return { error: 'Network error' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
