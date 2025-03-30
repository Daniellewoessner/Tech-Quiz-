
/// <reference types="cypress" />

import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react18';

import { describe } from 'mocha';
describe('<Quiz /> Component', () => {
  const mockQuestions = [
    {
      _id: '1',
      question: 'Which planet is known as the Red Planet?',
      answers: [
        { text: 'Venus', isCorrect: false },
        { text: 'Jupiter', isCorrect: false },
        { text: 'Mars', isCorrect: true },
        { text: 'Saturn', isCorrect: false },
      ],
    },
    {
      _id: '2',
      question: "Who wrote the play 'Romeo and Juliet'?",
      answers: [
        { text: 'William Shakespeare', isCorrect: true },
        { text: 'Charles Dickens', isCorrect: false },
        { text: 'Jane Austen', isCorrect: false },
        { text: 'Mark Twain', isCorrect: false },
      ],
    },
  ];

  beforeEach(() => {
    // Mock API response
    cy.intercept('GET', '/api/questions/random', {
      statusCode: 200,
      body: mockQuestions,
    }).as('getQuestions');
  });


  it('should render the start button', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should start the quiz and load the first question', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Verify the first question is loaded
    cy.get('h2').contains(mockQuestions[0].question).should('be.visible');
    cy.get('.btn-primary').should('have.length', 4); // Verify answer options
  });

  it('should load the next question after an answer is selected', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer the first question
    cy.get('.btn-primary').first().click();

    // Verify the next question is displayed
    cy.get('h2').contains(mockQuestions[1].question).should('be.visible');
  });

  it('should show quiz completed and display the score after all questions are answered', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer all questions
    cy.get('.btn-primary').first().click(); // Answer first question
    cy.get('.btn-primary').first().click(); // Answer second question

    // Verify quiz completion
    cy.get('h2').contains('Quiz Completed').should('be.visible');
    cy.get('.alert-success').should('contain', 'Your score');
    cy.get('button').contains('Take New Quiz').should('be.visible');
  });
  
  it('should increment score when correct answers are selected', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer the first question correctly
    cy.get('.btn-primary').contains('Mars').click(); // Correct answer for the first question

    // Answer the second question incorrectly
    cy.get('.btn-primary').contains('Charles Dickens').click(); // Incorrect answer for the second question

    // Verify the score
    cy.get('.alert-success').should('contain', 'Your score: 1/2');
});

 
it('should start a new quiz when "Take New Quiz" is clicked', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer all questions
    cy.get('.btn-primary').first().click(); // Answer first question
    cy.get('.btn-primary').first().click(); // Answer second question

    // Start a new quiz
    cy.get('button').contains('Take New Quiz').click();
    cy.wait('@getQuestions');

    // Verify the first question of the new quiz is loaded
    cy.get('h2').contains(mockQuestions[0].question).should('be.visible');
  });
});
it('should give full score when all answers are correct', () => {
  mount(<Quiz />);
  cy.get('button').contains('Start Quiz').click();
  cy.wait('@getQuestions');
  // Answer all questions correctly
  cy.get('.btn-primary').contains('Mars').click(); // Correct answer for the first question
  cy.get('.btn-primary').contains('William Shakespeare').click(); // Correct answer for the second question
  // Verify the score
  cy.get('.alert-success').should('contain', 'Your score: 2/2');
});
  it('should give zero score when all answers are incorrect', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    // Answer all questions incorrectly
    cy.get('.btn-primary').contains('Venus').click(); // Incorrect answer for the first question
    cy.get('.btn-primary').contains('Charles Dickens').click(); // Incorrect answer for the second question
    // Verify the score
    cy.get('.alert-success').should('contain', 'Your score: 0/2');
  });
  it('should give partial score for partially correct answers', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    // Answer the first question correctly and the second incorrectly
    cy.get('.btn-primary').contains('Mars').click(); // Correct answer for the first question
    cy.get('.btn-primary').contains('Charles Dickens').click(); // Incorrect answer for the second question
    // Verify the score
    cy.get('.alert-success').should('contain', 'Your score: 1/2');
  }
  );



