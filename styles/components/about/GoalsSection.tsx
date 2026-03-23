import React from 'react';
import { Award, TrendingUp, Users, Globe, BookOpen, Lightbulb } from 'lucide-react';
import AnimatedDecorativeLine from '@/components/feature/AnimatedDecorativeLine';

type GoalProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const goals: GoalProps[] = [
  {
    icon: <Award className="h-8 w-8 text-teal-600" />,
    title: 'Academic Excellence',
    description: 'We strive to maintain the highest standards of academic excellence, providing students with a rigorous and comprehensive education that prepares them for future success.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
    title: 'Innovative Learning',
    description: 'We embrace innovative teaching methodologies and technologies to create engaging, effective learning experiences that inspire curiosity and creativity.',
  },
  {
    icon: <Users className="h-8 w-8 text-teal-600" />,
    title: 'Student Success',
    description: 'We are committed to supporting every student\'s journey, providing personalized guidance and resources to help them achieve their full potential.',
  },
  {
    icon: <Globe className="h-8 w-8 text-teal-600" />,
    title: 'Global Perspective',
    description: 'We foster a global perspective, preparing students to thrive in an interconnected world through international partnerships and cultural exchange programs.',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-teal-600" />,
    title: 'Lifelong Learning',
    description: 'We instill a passion for lifelong learning, equipping students with the skills and mindset to continue growing and adapting throughout their lives.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-teal-600" />,
    title: 'Research & Innovation',
    description: 'We advance knowledge through research and innovation, contributing to solutions for global challenges and improving educational practices worldwide.',
  },
];

const GoalCard: React.FC<{ goal: GoalProps; index: number }> = ({ goal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-6">
        {goal.icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-3">{goal.title}</h3>
      <p className="text-gray-600">{goal.description}</p>
    </div>
  );
};

const achievements = [
  { number: '15+', label: 'Years of Excellence' },
  { number: '50k+', label: 'Students Educated' },
  { number: '120+', label: 'Global Partners' },
  { number: '25', label: 'Countries Reached' },
];

const GoalsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Our Strategic Goals
          </h2>
          
          <div className="flex justify-center mb-6">
            <AnimatedDecorativeLine width="w-24" height="h-1.5" color="from-teal-500 to-navy" />
          </div>
          
          <p className="text-lg text-gray-600">
            At MOVE, we are guided by clear strategic goals that drive our mission to 
            provide exceptional educational experiences and outcomes for all students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {goals.map((goal, index) => (
            <GoalCard key={goal.title} goal={goal} index={index} />
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-teal-900 to-navy rounded-xl overflow-hidden">
          <div className="px-6 py-12 md:py-16 lg:px-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Our Achievements
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{achievement.number}</div>
                  <div className="text-teal-200">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
