import { useState } from 'react';
import type { Question } from '../models/Question';
import { getQuestions } from '../services/questionApi';

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRandomQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await getQuestions();
      setQuestions(fetchedQuestions);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = async () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    await getRandomQuestions();
  };

  // Display start button if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="p-4 text-center">
        <button className="btn btn-primary" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    );
  }

  // Display error message if there's an error
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={handleStartQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  // Display loading spinner while fetching questions
  if (loading || questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Display quiz completion screen
  if (quizCompleted) {
    return (
      <div className="card p-4 text-center">
        <h2>Quiz Completed</h2>
        <div className="alert alert-success">
          Your score: {score}/{questions.length}
        </div>
        <button className="btn btn-primary" onClick={handleStartQuiz}>
          Take New Quiz
        </button>
      </div>
    );
  }

  // Display current question and answers
  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="card p-4">
      <h2>{currentQuestion.question}</h2>
      <div className="mt-3">
        {currentQuestion.answers.map((answer, index) => (
          <div key={index} className="alert alert-secondary mb-2">
            <button 
              className="btn btn-primary me-2" 
              onClick={() => handleAnswerClick(answer.isCorrect)}
            >
              {index + 1}
            </button>
            {answer.text}
          </div>
        ))}
      </div>
      <div className="progress mt-3">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
    </div>
  );
};

export default Quiz;