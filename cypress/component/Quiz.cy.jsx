import React from 'react';
import { mount } from 'cypress/react18';
import Quiz from '../../../client/src/components/Quiz';

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

// Create a stub for the getQuestions function
const getQuestionsStub = () => {
  return Promise.resolve(mockQuestions);
};

describe('Quiz Component - Basic Tests', () => {
  // Start with just a simple test to ensure mounting works
  it('renders correctly', () => {
    // Mock the getQuestions function
    cy.stub(window, 'getQuestions').callsFake(getQuestionsStub);
    
    // Mount the component
    mount(<Quiz />);
    
    // Check if the start button is rendered
    cy.get('button').should('exist');
    cy.contains('Start Quiz').should('exist');
  });
});

// These are advanced tests that you can uncomment once the basic test passes
/*
describe('Quiz Component - Advanced Tests', () => {
  beforeEach(() => {
    // Mock the getQuestions function
    cy.stub(window, 'getQuestions').callsFake(getQuestionsStub);
    
    // Mount the component
    mount(<Quiz />);
  });

  it('starts the quiz when clicking the start button', () => {
    cy.contains('Start Quiz').click();
    
    // The component might show a loading spinner first
    cy.get('body').then($body => {
      if ($body.find('.spinner-border').length > 0) {
        // Wait for spinner to disappear
        cy.get('.spinner-border').should('not.exist', { timeout: 5000 });
      }
      
      // Then check for the first question
      cy.get('h2').should('exist');
      cy.get('h2').should('contain', mockQuestions[0].question);
    });
  });

  it('allows selecting an answer and moves to the next question', () => {
    cy.contains('Start Quiz').click();
    
    // Wait for questions to load
    cy.get('h2').should('exist');
    
    // Click an answer
    cy.get('.btn.btn-primary').eq(1).click();
    
    // Should move to the next question
    cy.get('h2').should('contain', mockQuestions[1].question);
  });
});
*/