// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands
import './commands'

// Import mount
import { mount } from 'cypress/react18'

// TS type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Use Function approach to avoid the TypeScript error
function registerCommand() {
  // @ts-ignore
  return Cypress.Commands.add('mount', mount);
}

// Call the function to register the command
registerCommand();

// Make this file a module
export {}