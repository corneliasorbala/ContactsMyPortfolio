import { APIRequestContext, expect } from '@playwright/test';

export interface ContactData {
  _id?: string;
  firstName: string;
  lastName: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export class ContactApi {
  constructor(private request: APIRequestContext) {}

  /**
   * Adds a new contact via POST request.
   */
  async addContact(token: string, contact: ContactData): Promise<ContactData> {
    const response = await this.request.post('https://thinking-tester-contact-list.herokuapp.com/contacts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: contact,
    });
    expect(response.status()).toBe(201);
    return await response.json();
  }

  /**
   * Cleans up contacts by deleting them via API.
   */
  async deleteContact(token: string, contactId: string): Promise<void> {
    const response = await this.request.delete(`https://thinking-tester-contact-list.herokuapp.com/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(200);
  }
}