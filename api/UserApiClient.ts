import { APIRequestContext, APIResponse } from '@playwright/test';

export class UserApiClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = 'https://thinking-tester-contact-list.herokuapp.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Add a new user (POST /users)
   */
  async addUser(userData: Record<string, any>): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/users`, {
      data: userData,
    });
  }

  /**
   * Login user (POST /users/login)
   */
  async login(credentials: { email: string; password: string }): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/users/login`, {
      data: credentials,
    });
  }

  /**
   * Get user profile (GET /users/me)
   */
  async getUserProfile(token: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Update user profile (PATCH /users/me)
   */
  async updateUserProfile(token: string, updateData: Record<string, any>): Promise<APIResponse> {
    return await this.request.patch(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      data: updateData,
    });
  }

  /**
   * Logout user (POST /users/logout)
   */
  async logout(token: string): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/users/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Delete user account (DELETE /users/me)
   */
  async deleteUser(token: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}