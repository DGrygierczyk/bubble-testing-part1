// Import commands.js using ES2015 syntax:
import './commands'

import 'cypress-file-upload'

declare global {
  namespace Cypress {
    interface Chainable {
      fillForm(data: {
        firstName: string;
        lastName: string;
        email: string;
        gender: 'Male' | 'Female' | 'Other';
        mobile: string;
        dateOfBirth: { day: string; month: string; year: string };
        subjects: string[];
        hobbies: ('Sports' | 'Reading' | 'Music')[];
        address: string;
        state: string;
        city: string;
      }): Chainable<void>;
    }
  }
} 