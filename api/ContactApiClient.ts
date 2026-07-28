import { APIRequestContext, APIResponse } from '@playwright/test';

export class ContactApiClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = 'https://thinking-tester-contact-list.herokuapp.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Add a new contact (POST /contacts)
   */
  async addContact(token: string, contactData: Record<string, any>): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
      data: contactData,
    });
  }

  /**
   * Get list of contacts for the authenticated user (GET /contacts)
   */
  async getContacts(token: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Get a single contact by ID (GET /contacts/:id)
   */
  async getContactById(token: string, contactId: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Update contact details (PUT /contacts/:id)
   */
  async updateContact(token: string, contactId: string, contactData: Record<string, any>): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: contactData,
    });
  }

  /**
   * Delete a contact (DELETE /contacts/:id)
   */
  async deleteContact(token: string, contactId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}