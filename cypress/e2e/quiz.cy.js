
describe('Knowledge Quiz E2E Tests', () => {
  const mockQuestions = [
    {
      "_id": "1",
      "question": "Which planet is known as the Red Planet?",
      "answers": [
        { "text": "Venus", "isCorrect": false },
        { "text": "Jupiter", "isCorrect": false },
        { "text": "Mars", "isCorrect": true },
        { "text": "Saturn", "isCorrect": false }
      ]
    },
    {
      "_id": "2",
      "question": "Who wrote the play 'Romeo and Juliet'?",
      "answers": [
        { "text": "William Shakespeare", "isCorrect": true },
        { "text": "Charles Dickens", "isCorrect": false },
        { "text": "Jane Austen", "isCorrect": false },
        { "text": "Mark Twain", "isCorrect": false }
      ]
    }
  ]

  beforeEach(() => {
    // Mock the API response with our mockQuestions
    cy.intercept('GET', '/api/questions/random', {
      statusCode: 200,
      body: mockQuestions
    }).as('getQuestions')
    
    // Visit the application
    cy.visit('/')
  })

  it('should display the home page with start button', () => {
    cy.get('button').contains('Start Quiz').should('be.visible')
  })

  it('should start the quiz when clicking the start button', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Should display the first question
    cy.get('h2').should('contain', mockQuestions[0].question)
    cy.get('.btn-primary').should('have.length', 4)
  })

  it('should navigate through all questions and show final score', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Answer the first question (click any answer)
    cy.get('.btn-primary').first().click()
    
    // Answer the second question (click any answer)
    cy.get('.btn-primary').first().click()
    
    // Validate the quiz completion screen
    cy.get('h2').contains('Quiz Completed').should('be.visible')
    cy.get('.alert-success').should('contain', 'Your score:')
    cy.get('button').contains('Take New Quiz').should('be.visible')
  })

  it('should be able to take a new quiz after completing one', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Answer both questions to complete the quiz
    cy.get('.btn-primary').first().click()
    cy.get('.btn-primary').first().click()
    
    // After quiz completion, start a new one
    cy.get('button').contains('Take New Quiz').click()
    cy.wait('@getQuestions')
    
    // Verify we're in a new quiz
    cy.get('h2').should('contain', mockQuestions[0].question)
    cy.get('.btn-primary').should('have.length', 4)
  })

    
  it('should give full score when all answers are correct', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Click the correct answer for the first question (option with "Mars")
    cy.get('.alert-secondary').contains('Mars').parent().find('button').click()
    
    // Click the correct answer for the second question (option with "William Shakespeare")
    cy.get('.alert-secondary').contains('William Shakespeare').parent().find('button').click()
    
    // Verify final score is 2/2
    cy.get('.alert-success').should('contain', '2/2')
  })

  it('should give zero score when all answers are incorrect', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Click an incorrect answer for the first question
    cy.get('.alert-secondary').contains('Venus').parent().find('button').click()
    
    // Click an incorrect answer for the second question
    cy.get('.alert-secondary').contains('Charles Dickens').parent().find('button').click()
    
    // Verify final score is 0/2
    cy.get('.alert-success').should('contain', '0/2')
  })

  it('should give partial score for partially correct answers', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Click the correct answer for the first question
    cy.get('.alert-secondary').contains('Mars').parent().find('button').click()
    
    // Click an incorrect answer for the second question
    cy.get('.alert-secondary').contains('Jane Austen').parent().find('button').click()
    
    // Verify final score is 1/2
    cy.get('.alert-success').should('contain', '1/2')
  })
})