// src/utils/TestDataGenerator.ts
import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: 'Password123!',
    };
  }

  static generateContact() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthdate: '1990-01-01',
      email: faker.internet.email().toLowerCase(),
      phone: '8005550199',
      street1: faker.location.streetAddress(),
      city: faker.location.city(),
      stateProvince: faker.location.state({ abbreviated: true }),
      postalCode: '12345',
      country: 'USA',
    };
  }
}