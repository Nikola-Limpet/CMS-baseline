"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb, Share2, Clock, RotateCcw, CheckCircle } from 'lucide-react';
import KatexRenderer from '@/components/common/KatexRenderer';

interface Problem {
  id: string;
  date: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hints: string[];
  solution: {
    steps: string[];
    answer: string;
  };
  timeEstimate: number; // in minutes
}

// In a real app, this would fetch from an API
const todaysProblem: Problem = {
  id: 'prob-2024-07-14',
  date: new Date().toISOString().split('T')[0],
  question: 'Find all positive integers n such that n^2 + 19n + 48 is a perfect square.',
  difficulty: 'medium',
  category: 'Number Theory',
  hints: [
    'Let n^2 + 19n + 48 = k^2 for some positive integer k',
    'Try factoring: n^2 + 19n + 48 = (n + a)(n + b)',
    'Consider the discriminant of the quadratic'
  ],
  solution: {
    steps: [
      'Let n^2 + 19n + 48 = k^2 for some positive integer k',
      'Rearranging: n^2 + 19n + 48 - k^2 = 0',
      'Using the quadratic formula: n = \\frac{-19 \\pm \\sqrt{361 - 4(48 - k^2)}}{2}',
      'For n to be an integer, 361 - 192 + 4k^2 must be a perfect square',
      'So 4k^2 + 169 must be a perfect square, say m^2',
      'This gives us: (m - 2k)(m + 2k) = 169 = 13^2',
      'The factor pairs of 169 are: (1, 169) and (13, 13)',
      'From (13, 13): m = 13, k = 0 (not valid since k must be positive)',
      'From (1, 169): m = 85, k = 42',
      'Substituting back: n = 33 or n = -52',
      'Since we need positive n, we have n = 33'
    ],
    answer: 'n = 33'
  },
  timeEstimate: 15
};

export default function ProblemOfTheDay() {
  const [showHint, setShowHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAttempt, setUserAttempt] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(todaysProblem.timeEstimate * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = () => {
    const normalized = userAttempt.toLowerCase().replace(/\s/g, '');
    const correct = normalized.includes('33') || normalized.includes('n=33');
    setIsCorrect(correct);
  };

  const resetProblem = () => {
    setShowHint(0);
    setShowSolution(false);
    setCurrentStep(0);
    setUserAttempt('');
    setIsCorrect(null);
    setTimeRemaining(todaysProblem.timeEstimate * 60);
    setTimerActive(false);
  };

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Problem of the Day
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600"
        >
          Challenge yourself with today's mathematical puzzle
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">{todaysProblem.date}</p>
              <h3 className="text-xl font-bold mt-1">{todaysProblem.category}</h3>
            </div>
            <div className="flex items-center gap-4">
              {/* Difficulty */}
              <div className="flex gap-1">
                {['easy', 'medium', 'hard'].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      ['easy', 'medium', 'hard'].indexOf(todaysProblem.difficulty) >= 
                      ['easy', 'medium', 'hard'].indexOf(level)
                        ? 'bg-yellow-300' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              {/* Timer */}
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                <Clock size={16} />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Problem Content */}
        <div className="p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="text-blue-600 mt-1" size={24} />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">The Problem:</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {todaysProblem.question}
                </p>
              </div>
            </div>
          </div>

          {/* Hints Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-500" size={20} />
              <h4 className="font-semibold">Need a hint?</h4>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {todaysProblem.hints.slice(0, showHint).map((hint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm"
                  >
                    Hint {index + 1}: {hint}
                  </motion.div>
                ))}
              </AnimatePresence>
              {showHint < todaysProblem.hints.length && (
                <button
                  onClick={() => setShowHint(prev => prev + 1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Show hint ({showHint + 1}/{todaysProblem.hints.length})
                </button>
              )}
            </div>
          </div>

          {/* Answer Input */}
          {!showSolution && (
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Your Answer:</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userAttempt}
                  onChange={(e) => setUserAttempt(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={checkAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check
                </button>
              </div>
              
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                    isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle size={20} />
                      Correct! Well done!
                    </>
                  ) : (
                    <>
                      <span>Not quite. Try again or view the solution.</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Solution Section */}
          {showSolution && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t pt-6"
            >
              <h4 className="font-semibold text-lg mb-4">Step-by-Step Solution:</h4>
              <div className="space-y-3">
                <AnimatePresence>
                  {todaysProblem.solution.steps.slice(0, currentStep + 1).map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 pt-1">
                        <KatexRenderer textWithMath={step} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {currentStep < todaysProblem.solution.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Next step →
                </button>
              ) : (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-800">
                    Final Answer: <KatexRenderer textWithMath={todaysProblem.solution.answer} />
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-3">
              {!showSolution && (
                <button
                  onClick={() => setShowSolution(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Show Solution
                </button>
              )}
              <button
                onClick={resetProblem}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
            
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}