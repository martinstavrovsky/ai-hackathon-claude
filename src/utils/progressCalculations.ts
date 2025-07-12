import { BreakSession, ProgressData } from '../types';

export function calculateDailyProgress(
  breakHistory: BreakSession[],
  targetBreaksPerDay: number = 8
): ProgressData['daily'] {
  const today = new Date().toDateString();
  const todaysSessions = breakHistory.filter(
    session => session.startTime && new Date(session.startTime).toDateString() === today
  );

  const breaksTaken = todaysSessions.filter(session => !session.skipped).length;
  const exercisesCompleted = todaysSessions.reduce((total, session) => {
    return total + (session.completedExercises?.length || 0);
  }, 0);

  const totalBreakTime = todaysSessions.reduce((total, session) => {
    if (session.startTime && session.endTime) {
      return total + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
    }
    return total;
  }, 0);

  const streak = calculateCurrentStreak(breakHistory);

  return {
    date: today,
    breaksTaken,
    breaksScheduled: targetBreaksPerDay,
    exercisesCompleted,
    totalBreakTime: Math.round(totalBreakTime / 1000),
    streak
  };
}

export function calculateWeeklyProgress(
  breakHistory: BreakSession[]
): ProgressData['weekly'] {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekSessions = breakHistory.filter(session => {
    if (!session.startTime) return false;
    const sessionDate = new Date(session.startTime);
    return sessionDate >= weekStart && sessionDate < weekEnd;
  });

  const completedSessions = weekSessions.filter(session => !session.skipped);
  const totalBreaks = completedSessions.length;
  const totalExercises = completedSessions.reduce((total, session) => {
    return total + (session.completedExercises?.length || 0);
  }, 0);

  const exerciseCount: Record<string, number> = {};
  completedSessions.forEach(session => {
    session.exercises.forEach(exercise => {
      exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
    });
  });

  const favoriteExercises = Object.entries(exerciseCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name);

  const ratingsSum = completedSessions.reduce((sum, session) => {
    return sum + (session.feedback?.rating || 3);
  }, 0);
  const averageRating = completedSessions.length > 0 ? ratingsSum / completedSessions.length : 0;

  return {
    weekStart: weekStart.toISOString(),
    totalBreaks,
    totalExercises,
    favoriteExercises,
    averageRating
  };
}

export function calculateMonthlyProgress(
  breakHistory: BreakSession[]
): ProgressData['monthly'] {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthSessions = breakHistory.filter(session => {
    if (!session.startTime) return false;
    const sessionDate = new Date(session.startTime);
    return sessionDate >= monthStart && sessionDate <= monthEnd;
  });

  const completedSessions = monthSessions.filter(session => !session.skipped);
  const totalBreaks = completedSessions.length;

  const consistencyScore = calculateConsistencyScore(completedSessions, monthStart, monthEnd);
  const varietyScore = calculateVarietyScore(completedSessions);
  const engagementScore = calculateEngagementScore(completedSessions);

  return {
    month: monthStart.toISOString(),
    totalBreaks,
    improvementMetrics: {
      consistencyScore,
      varietyScore,
      engagementScore
    }
  };
}

function calculateCurrentStreak(breakHistory: BreakSession[]): number {
  const sortedSessions = [...breakHistory]
    .filter(session => session.startTime && !session.skipped)
    .sort((a, b) => new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime());

  if (sortedSessions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.startTime!);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

function calculateConsistencyScore(
  sessions: BreakSession[],
  startDate: Date,
  endDate: Date
): number {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const daysWithBreaks = new Set();

  sessions.forEach(session => {
    if (session.startTime) {
      const sessionDate = new Date(session.startTime).toDateString();
      daysWithBreaks.add(sessionDate);
    }
  });

  return Math.round((daysWithBreaks.size / totalDays) * 100);
}

function calculateVarietyScore(sessions: BreakSession[]): number {
  const uniqueExercises = new Set();
  const totalExercises = sessions.reduce((total, session) => {
    session.exercises.forEach(exercise => {
      uniqueExercises.add(exercise.id);
    });
    return total + session.exercises.length;
  }, 0);

  if (totalExercises === 0) return 0;
  return Math.round((uniqueExercises.size / totalExercises) * 100);
}

function calculateEngagementScore(sessions: BreakSession[]): number {
  if (sessions.length === 0) return 0;

  const completionRate = sessions.reduce((total, session) => {
    const completed = session.completedExercises?.length || 0;
    const total_exercises = session.exercises.length;
    return total + (completed / total_exercises);
  }, 0) / sessions.length;

  const averageRating = sessions.reduce((total, session) => {
    return total + (session.feedback?.rating || 3);
  }, 0) / sessions.length;

  return Math.round(((completionRate * 0.7) + (averageRating / 5 * 0.3)) * 100);
}

export function getProgressInsights(progressData: ProgressData): string[] {
  const insights: string[] = [];
  const { daily, weekly, monthly } = progressData;

  if (daily.streak > 0) {
    insights.push(`🔥 You're on a ${daily.streak}-day streak! Keep it up!`);
  }

  if (daily.breaksTaken >= daily.breaksScheduled) {
    insights.push(`🎯 You've met your daily break goal!`);
  } else if (daily.breaksTaken > 0) {
    const remaining = daily.breaksScheduled - daily.breaksTaken;
    insights.push(`📈 ${remaining} more break${remaining > 1 ? 's' : ''} to reach your daily goal`);
  }

  if (weekly.totalExercises > 0) {
    insights.push(`💪 You've completed ${weekly.totalExercises} exercises this week`);
  }

  if (weekly.favoriteExercises.length > 0) {
    insights.push(`⭐ Your favorite exercise this week: ${weekly.favoriteExercises[0]}`);
  }

  if (monthly.improvementMetrics.consistencyScore >= 80) {
    insights.push(`🏆 Excellent consistency this month (${monthly.improvementMetrics.consistencyScore}%)`);
  } else if (monthly.improvementMetrics.consistencyScore >= 60) {
    insights.push(`📊 Good consistency this month (${monthly.improvementMetrics.consistencyScore}%)`);
  }

  if (monthly.improvementMetrics.varietyScore >= 70) {
    insights.push(`🌟 Great exercise variety this month!`);
  }

  if (insights.length === 0) {
    insights.push(`🌱 Start taking breaks to see your progress insights!`);
  }

  return insights;
}