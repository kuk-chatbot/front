'use client';

import type { User } from '@/types/user';
import axios, { AxiosError, AxiosResponse } from 'axios';

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
const user = {
  avatar: '/assets/avatar.png',
  userName: 'hanyang',
  role: 'personal',
} satisfies User;

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

interface AuthResponse {
  jwtToken: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response: AxiosResponse<unknown> = await axios.post('http://localhost:8000/auth/sign-up', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      

      if (response.status !== 200) {
        const errorData = response.data as ErrorResponse;
        return { error: errorData.message || 'Something went wrong' };
      }
      
      return {};
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return { error: axiosError.response?.data.message || 'Network error' };
    }
  }

  private isErrorResponse(data: unknown): data is ErrorResponse {
    return typeof data === 'object' && data !== null && 'message' in data;
  }

  private isAuthResponse(data: unknown): data is AuthResponse {
    return typeof data === 'object' && data !== null && 'jwtToken' in data;
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const response: AxiosResponse<unknown> = await axios.post('http://localhost:8000/auth/sign-in', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });





      if (response.status !== 200) {
        const errorData = response.data as ErrorResponse;
        return { error: errorData.message || 'Invalid credentials' };
      }

      const responseData = response.data as AuthResponse;




      localStorage.setItem('custom-auth-token', responseData.jwtToken);
      
      return {};
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return { error: axiosError.response?.data.message || 'Network error' };
    }
  }


  async getUser(): Promise<{ data?: User | null; error?: string }> {




    const token = localStorage.getItem('custom-auth-token');



    if (!token) {
      return { data: null };
    }


    

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
