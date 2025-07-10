import { WorkdaySchedule, WorkdayMeeting } from '../types';

export const mockWorkdayData: WorkdaySchedule[] = [
  {
    date: '2024-01-15',
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: [
      {
        id: 'meeting-1',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-2',
        title: 'Project Review',
        startTime: '10:00',
        endTime: '11:00',
        type: 'meeting',
        participants: 4,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-3',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        type: 'lunch',
        participants: 1,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-4',
        title: 'Focus Time - Development',
        startTime: '14:00',
        endTime: '16:00',
        type: 'focus-time',
        participants: 1,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-5',
        title: 'Client Call',
        startTime: '16:00',
        endTime: '17:00',
        type: 'meeting',
        participants: 8,
        isOptional: false,
        location: 'remote'
      }
    ],
    timeOff: null,
    workload: 'heavy'
  },
  {
    date: '2024-01-16',
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: [
      {
        id: 'meeting-6',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-7',
        title: 'One-on-One with Manager',
        startTime: '11:00',
        endTime: '11:30',
        type: 'meeting',
        participants: 2,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-8',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        type: 'lunch',
        participants: 1,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-9',
        title: 'Code Review Session',
        startTime: '15:00',
        endTime: '16:00',
        type: 'meeting',
        participants: 3,
        isOptional: true,
        location: 'remote'
      }
    ],
    timeOff: null,
    workload: 'moderate'
  },
  {
    date: '2024-01-17',
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: [
      {
        id: 'meeting-10',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-11',
        title: 'Sprint Planning',
        startTime: '10:00',
        endTime: '12:00',
        type: 'meeting',
        participants: 8,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-12',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        type: 'lunch',
        participants: 1,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-13',
        title: 'Architecture Discussion',
        startTime: '14:00',
        endTime: '15:30',
        type: 'meeting',
        participants: 5,
        isOptional: false,
        location: 'remote'
      }
    ],
    timeOff: null,
    workload: 'heavy'
  },
  {
    date: '2024-01-18',
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: [
      {
        id: 'meeting-14',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-15',
        title: 'Focus Time - Deep Work',
        startTime: '10:00',
        endTime: '12:00',
        type: 'focus-time',
        participants: 1,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-16',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        type: 'lunch',
        participants: 1,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-17',
        title: 'Training Session',
        startTime: '14:00',
        endTime: '15:00',
        type: 'meeting',
        participants: 12,
        isOptional: true,
        location: 'remote'
      }
    ],
    timeOff: null,
    workload: 'moderate'
  },
  {
    date: '2024-01-19',
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: [
      {
        id: 'meeting-18',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      },
      {
        id: 'meeting-19',
        title: 'Sprint Review & Demo',
        startTime: '10:00',
        endTime: '11:00',
        type: 'meeting',
        participants: 10,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-20',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        type: 'lunch',
        participants: 1,
        isOptional: false,
        location: 'office'
      },
      {
        id: 'meeting-21',
        title: 'Team Social Hour',
        startTime: '16:00',
        endTime: '17:00',
        type: 'meeting',
        participants: 8,
        isOptional: true,
        location: 'office'
      }
    ],
    timeOff: null,
    workload: 'light'
  }
];

export function generateMockSchedule(dateRange: { start: string; end: string }): WorkdaySchedule[] {
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  const schedules: WorkdaySchedule[] = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const schedule = generateDaySchedule(currentDate, dayOfWeek);
    schedules.push(schedule);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
}

function generateDaySchedule(date: Date, dayOfWeek: number): WorkdaySchedule {
  const dateStr = date.toISOString().split('T')[0];
  const meetings: WorkdayMeeting[] = [];
  let workload: 'light' | 'moderate' | 'heavy' = 'moderate';

  meetings.push({
    id: `standup-${dateStr}`,
    title: 'Team Standup',
    startTime: '09:00',
    endTime: '09:30',
    type: 'meeting',
    participants: 6,
    isOptional: false,
    location: 'remote'
  });

  meetings.push({
    id: `lunch-${dateStr}`,
    title: 'Lunch Break',
    startTime: '12:00',
    endTime: '13:00',
    type: 'lunch',
    participants: 1,
    isOptional: false,
    location: 'office'
  });

  switch (dayOfWeek) {
    case 1:
      workload = 'heavy';
      meetings.push({
        id: `planning-${dateStr}`,
        title: 'Weekly Planning',
        startTime: '10:00',
        endTime: '11:30',
        type: 'meeting',
        participants: 8,
        isOptional: false,
        location: 'office'
      });
      meetings.push({
        id: `review-${dateStr}`,
        title: 'Project Review',
        startTime: '14:00',
        endTime: '15:30',
        type: 'meeting',
        participants: 6,
        isOptional: false,
        location: 'remote'
      });
      break;

    case 2:
      workload = 'moderate';
      meetings.push({
        id: `oneOnOne-${dateStr}`,
        title: 'One-on-One with Manager',
        startTime: '11:00',
        endTime: '11:30',
        type: 'meeting',
        participants: 2,
        isOptional: false,
        location: 'office'
      });
      meetings.push({
        id: `focus-${dateStr}`,
        title: 'Focus Time - Development',
        startTime: '14:00',
        endTime: '16:00',
        type: 'focus-time',
        participants: 1,
        isOptional: false,
        location: 'remote'
      });
      break;

    case 3:
      workload = 'heavy';
      meetings.push({
        id: `sprint-${dateStr}`,
        title: 'Sprint Planning',
        startTime: '10:00',
        endTime: '12:00',
        type: 'meeting',
        participants: 8,
        isOptional: false,
        location: 'office'
      });
      meetings.push({
        id: `architecture-${dateStr}`,
        title: 'Architecture Discussion',
        startTime: '14:00',
        endTime: '15:30',
        type: 'meeting',
        participants: 5,
        isOptional: false,
        location: 'remote'
      });
      break;

    case 4:
      workload = 'moderate';
      meetings.push({
        id: `deepWork-${dateStr}`,
        title: 'Focus Time - Deep Work',
        startTime: '10:00',
        endTime: '12:00',
        type: 'focus-time',
        participants: 1,
        isOptional: false,
        location: 'remote'
      });
      meetings.push({
        id: `training-${dateStr}`,
        title: 'Training Session',
        startTime: '14:00',
        endTime: '15:00',
        type: 'meeting',
        participants: 12,
        isOptional: true,
        location: 'remote'
      });
      break;

    case 5:
      workload = 'light';
      meetings.push({
        id: `demo-${dateStr}`,
        title: 'Sprint Demo',
        startTime: '10:00',
        endTime: '11:00',
        type: 'meeting',
        participants: 10,
        isOptional: false,
        location: 'office'
      });
      meetings.push({
        id: `social-${dateStr}`,
        title: 'Team Social Hour',
        startTime: '16:00',
        endTime: '17:00',
        type: 'meeting',
        participants: 8,
        isOptional: true,
        location: 'office'
      });
      break;
  }

  return {
    date: dateStr,
    workingHours: {
      start: '09:00',
      end: '17:00',
      totalHours: 8
    },
    meetings: meetings.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    timeOff: null,
    workload
  };
}