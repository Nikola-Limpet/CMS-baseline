"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Competition {
  id: string;
  name: string;
  shortName: string;
  date: Date;
  registrationDeadline: Date;
  location: string;
  participants: number;
  maxParticipants: number;
  color: string;
  link: string;
}

const upcomingCompetitions: Competition[] = [
  {
    id: 'imo-2024',
    name: 'International Mathematical Olympiad',
    shortName: 'IMO 2024',
    date: new Date('2024-08-15T09:00:00'),
    registrationDeadline: new Date('2024-07-30T23:59:59'),
    location: 'Bath, United Kingdom',
    participants: 450,
    maxParticipants: 600,
    color: 'from-blue-500 to-indigo-600',
    link: '/competitions/imo-2024'
  },
  {
    id: 'apmo-2024',
    name: 'Asia Pacific Mathematics Olympiad',
    shortName: 'APMO 2024',
    date: new Date('2024-09-10T09:00:00'),
    registrationDeadline: new Date('2024-08-25T23:59:59'),
    location: 'Singapore',
    participants: 320,
    maxParticipants: 500,
    color: 'from-purple-500 to-pink-600',
    link: '/competitions/apmo-2024'
  },
  {
    id: 'national-2024',
    name: 'National Mathematics Competition',
    shortName: 'NMC 2024',
    date: new Date('2024-07-25T09:00:00'),
    registrationDeadline: new Date('2024-07-20T23:59:59'),
    location: 'Phnom Penh, Cambodia',
    participants: 280,
    maxParticipants: 300,
    color: 'from-green-500 to-teal-600',
    link: '/competitions/nmc-2024'
  }
];

interface TimeUnit {
  value: number;
  label: string;
}

function FlipCard({ value, label }: TimeUnit) {
  const [prevValue, setPrevValue] = useState(value);
  
  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24">
        <motion.div
          key={value}
          initial={{ rotateX: -90 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="absolute inset-0 bg-gray-900 text-white rounded-lg flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="text-2xl md:text-3xl font-bold font-mono">
            {value.toString().padStart(2, '0')}
          </span>
        </motion.div>
      </div>
      <span className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function CompetitionCountdown() {
  const [selectedCompetition, setSelectedCompetition] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const currentCompetition = upcomingCompetitions[selectedCompetition];

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = currentCompetition.date.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [currentCompetition]);

  const registrationProgress = (currentCompetition.participants / currentCompetition.maxParticipants) * 100;
  const daysUntilDeadline = Math.ceil((currentCompetition.registrationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Upcoming Competitions
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600"
        >
          Don't miss your chance to compete with the best
        </motion.p>
      </div>

      {/* Competition Selector */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {upcomingCompetitions.map((comp, index) => (
          <motion.button
            key={comp.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCompetition(index)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedCompetition === index 
                ? 'bg-gradient-to-r text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
            style={selectedCompetition === index ? {
              backgroundImage: `linear-gradient(to right, ${comp.color.split(' ')[1]}, ${comp.color.split(' ')[3]})`
            } : {}}
          >
            {comp.shortName}
          </motion.button>
        ))}
      </div>

      {/* Main Countdown Display */}
      <motion.div
        layout
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div 
          className={`bg-gradient-to-r ${currentCompetition.color} text-white p-8`}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            {currentCompetition.name}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{currentCompetition.date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{currentCompetition.location}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Countdown Display */}
          <div className="flex justify-center gap-4 md:gap-8 mb-8">
            <FlipCard value={timeRemaining.days} label="Days" />
            <FlipCard value={timeRemaining.hours} label="Hours" />
            <FlipCard value={timeRemaining.minutes} label="Minutes" />
            <FlipCard value={timeRemaining.seconds} label="Seconds" />
          </div>

          {/* Registration Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700">Registration Progress</h4>
              <span className="text-sm text-gray-600">
                {currentCompetition.participants} / {currentCompetition.maxParticipants} participants
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${registrationProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentCompetition.color}`}
              />
            </div>
            {daysUntilDeadline > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Registration closes in {daysUntilDeadline} days
              </p>
            )}
          </div>

          {/* Math Symbols Animation */}
          <div className="relative h-20 mb-8 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {['∑', '∫', 'π', '∞', '√', 'θ', 'φ'].map((symbol, index) => (
                <motion.span
                  key={index}
                  className="absolute text-2xl text-gray-300"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ 
                    x: [-(index * 30), 300 + (index * 30)],
                    opacity: [0, 0.5, 0.5, 0]
                  }}
                  transition={{
                    duration: 10,
                    delay: index * 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {symbol}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={currentCompetition.link}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Register Now
              <ArrowRight size={18} />
            </Link>
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <Users size={18} />
              View Participants
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 bg-white rounded-xl shadow-md"
        >
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{upcomingCompetitions.length}</p>
          <p className="text-sm text-gray-600">Active Competitions</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-white rounded-xl shadow-md"
        >
          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {upcomingCompetitions.reduce((sum, comp) => sum + comp.participants, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Participants</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-white rounded-xl shadow-md"
        >
          <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {new Set(upcomingCompetitions.map(c => c.location.split(',')[1]?.trim() || c.location)).size}
          </p>
          <p className="text-sm text-gray-600">Countries</p>
        </motion.div>
      </div>
    </div>
  );
}