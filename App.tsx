
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Question, UserAnswer, QuizStatus } from './types';
import { ALL_QUESTIONS } from './constants';
import Navigation from './components/Navigation';
import QuizSetupPage from './pages/QuizSetupPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import WrongAnswersPage from './pages/WrongAnswersPage';

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.NOT_STARTED);

  const handleStartQuiz = useCallback((numQuestions: number) => {
    const shuffled = shuffleArray(ALL_QUESTIONS);
    setQuizQuestions(shuffled.slice(0, numQuestions));
    setUserAnswers([]);
    setFinalScore(0);
    setQuizStatus(QuizStatus.IN_PROGRESS);
  }, []);

  const handleQuizComplete = useCallback((answers: UserAnswer[], score: number) => {
    setUserAnswers(answers);
    setFinalScore(score);
    setQuizStatus(QuizStatus.COMPLETED);
  }, []);
  
  const handleRestartQuiz = useCallback(() => {
    setQuizStatus(QuizStatus.NOT_STARTED);
    setQuizQuestions([]); // Clear questions so QuizPage redirects if accessed directly
  }, []);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                quizStatus === QuizStatus.NOT_STARTED || quizStatus === QuizStatus.COMPLETED ? (
                  <QuizSetupPage onStartQuiz={handleStartQuiz} />
                ) : (
                  <Navigate to="/quiz" replace />
                )
              } 
            />
            <Route 
              path="/quiz" 
              element={
                quizStatus === QuizStatus.IN_PROGRESS && quizQuestions.length > 0 ? (
                  <QuizPage questions={quizQuestions} onQuizComplete={handleQuizComplete} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/results" 
              element={
                quizStatus === QuizStatus.COMPLETED ? (
                  <QuizResultsPage 
                    userAnswers={userAnswers} 
                    score={finalScore} 
                    totalQuestions={quizQuestions.length}
                    onRestartQuiz={handleRestartQuiz}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }  
            />
            <Route path="/wrong-answers" element={<WrongAnswersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all for unknown routes */}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
