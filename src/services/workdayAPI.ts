import { WorkdaySchedule, WorkdayMeeting } from '../types';
import { generateMockSchedule } from '../data/mockWorkdayData';

export interface WorkdayCredentials {
  username: string;
  password: string;
}

export interface WorkdayAuthResponse {
  success: boolean;
  token?: string;
  employeeId?: string;
  expires?: Date;
  error?: string;
}

export class MockWorkdayAPI {
  private static instance: MockWorkdayAPI;
  private authToken: string | null = null;
  private employeeId: string | null = null;

  static getInstance(): MockWorkdayAPI {
    if (!MockWorkdayAPI.instance) {
      MockWorkdayAPI.instance = new MockWorkdayAPI();
    }
    return MockWorkdayAPI.instance;
  }

  async authenticate(credentials: WorkdayCredentials): Promise<WorkdayAuthResponse> {
    await this.simulateDelay(1000);

    if (credentials.username === 'demo' && credentials.password === 'demo') {
      this.authToken = `mock-jwt-token-${Date.now()}`;
      this.employeeId = 'EMP-12345';
      
      return {
        success: true,
        token: this.authToken,
        employeeId: this.employeeId,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
    }

    return {
      success: false,
      error: 'Invalid credentials. Use demo/demo for testing.'
    };
  }

  async getSchedule(
    employeeId: string,
    dateRange: { start: string; end: string }
  ): Promise<WorkdaySchedule[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    await this.simulateDelay(800);

    return generateMockSchedule(dateRange);
  }

  async getMeetings(employeeId: string, date: string): Promise<WorkdayMeeting[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    await this.simulateDelay(500);

    const schedule = generateMockSchedule({
      start: date,
      end: date
    });

    return schedule.length > 0 ? schedule[0].meetings : [];
  }

  async getTimeOff(
    employeeId: string,
    dateRange: { start: string; end: string }
  ): Promise<Array<{
    date: string;
    type: 'PTO' | 'sick' | 'personal' | 'holiday';
    duration: 'full-day' | 'partial';
    hours?: number;
  }>> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    await this.simulateDelay(600);

    const timeOffData = [
      {
        date: '2024-01-20',
        type: 'PTO' as const,
        duration: 'full-day' as const
      },
      {
        date: '2024-01-25',
        type: 'personal' as const,
        duration: 'partial' as const,
        hours: 4
      }
    ];

    return timeOffData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  async updateBreakPreferences(
    employeeId: string,
    preferences: {
      frequency: number;
      duration: number;
      exerciseTypes: string[];
      workingHours: { start: string; end: string };
    }
  ): Promise<{ success: boolean; message?: string }> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    await this.simulateDelay(400);

    console.log('Updated break preferences:', preferences);
    
    return {
      success: true,
      message: 'Break preferences updated successfully'
    };
  }

  async getEmployeeProfile(employeeId: string): Promise<{
    id: string;
    name: string;
    department: string;
    role: string;
    manager: string;
    workLocation: 'office' | 'remote' | 'hybrid';
  }> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    await this.simulateDelay(300);

    return {
      id: employeeId,
      name: 'John Doe',
      department: 'Engineering',
      role: 'Software Developer',
      manager: 'Jane Smith',
      workLocation: 'hybrid'
    };
  }

  logout(): void {
    this.authToken = null;
    this.employeeId = null;
  }

  isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  getCurrentEmployeeId(): string | null {
    return this.employeeId;
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}