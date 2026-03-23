export type CompetitionProblemOption = {
  id: string;
  text: string;
  isCorrect?: boolean; // For admin interface
};

export type CompetitionProblem = {
  id: string;
  competitionId: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  topic: string;
  ageGroup?: number[];
  points: number;
  timeLimit?: number; // in minutes
  problemStatement: string;
  problemImageUrl?: string;
  options: CompetitionProblemOption[];
  correctAnswerId: string;
  hint?: string;
  explanation?: string;

  // Problem management
  status: 'draft' | 'ready' | 'embargoed' | 'released' | 'archived';
  embargoedUntil?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type ProblemSet = {
  id: string;
  competitionId: string;
  title: string;
  description?: string;
  problems: CompetitionProblem[];
  totalPoints: number;
  estimatedTimeMinutes: number;
  ageGroups: number[];

  // Release scheduling
  releaseType: 'manual' | 'scheduled';
  scheduledReleaseTime?: Date;
  releasedAt?: Date;
  status: 'draft' | 'scheduled' | 'released' | 'completed' | 'archived';

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type ProblemSubmission = {
  id: string;
  problemId: string;
  competitionId: string;
  userId: string;
  teamId?: string;
  selectedOptionId: string;
  submittedAt: Date;
  timeSpentMinutes?: number;
  isCorrect: boolean;
  pointsEarned: number;
}; 