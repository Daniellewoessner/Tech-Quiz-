import React from 'react';
import { mount } from 'cypress/react18';
import Quiz from '../../client/src/components/Quiz.js';
// Import the service to mock it
import * as questionApi from '../../client/src/services/questionApi';
import { describe, beforeEach, it } from 'node:test';
import 'cypress'; // Import Cypress commands

// Define the mock questions that match your component's expected format
const mockQuestions = [
  {
    id: 1,
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", isCorrect: true },
      { text: "High Tech Modern Language", isCorrect: false },
      { text: "Hyper Transfer Markup Language", isCorrect: false },
      { text: "Hyperlink Text Management Language", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "Which of the following is NOT a JavaScript framework?",
    answers: [
      { text: "React", isCorrect: false },
      { text: "Angular", isCorrect: false },
      { text: "Vue", isCorrect: false },
      { text: "Ruby on Rails", isCorrect: true }
    ]
  }
];

describe('Quiz Component Test', () => {
  beforeEach(() => {
    // This is the correct way to mock an imported function
    cy.intercept('GET', '/api/questions', {
      statusCode: 200,
      body: mockQuestions,
    }).as('getQuestions');
    
    // Mount the component
    mount(<Quiz />);
  });

  it('displays the start button', () => {
    cy.contains('Start Quiz').should('exist');
  });

  it('starts the quiz and shows questions', () => {
    // Click start button
    cy.contains('Start Quiz').click();
    
    // Wait for questions to load (there might be a loading spinner first)
    cy.get('h2').should('exist', { timeout: 5000 });
    
    // Check if question text is displayed
    cy.get('h2').should('contain.text', mockQuestions[0].question);
  });
});