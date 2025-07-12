import { useState, useEffect } from 'react';

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const showNotification = (options: NotificationOptions): Notification | null => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
      });

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  };

  const showBreakReminder = (timeUntilBreak: number) => {
    const minutes = Math.floor(timeUntilBreak / 60);
    const seconds = timeUntilBreak % 60;
    
    let message = '';
    if (minutes > 0) {
      message = `Break time in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      message = `Break time in ${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    return showNotification({
      title: 'Break Reminder',
      body: message,
      tag: 'break-reminder',
      requireInteraction: false,
    });
  };

  const showBreakTime = () => {
    return showNotification({
      title: 'Break Time!',
      body: 'Time for your scheduled break. Click to start your exercises.',
      tag: 'break-time',
      requireInteraction: true,
    });
  };

  const showExerciseComplete = (exerciseName: string) => {
    return showNotification({
      title: 'Exercise Complete',
      body: `Great job completing ${exerciseName}!`,
      tag: 'exercise-complete',
      requireInteraction: false,
    });
  };

  const showBreakComplete = (exercisesCompleted: number) => {
    return showNotification({
      title: 'Break Complete',
      body: `Well done! You completed ${exercisesCompleted} exercise${exercisesCompleted > 1 ? 's' : ''}.`,
      tag: 'break-complete',
      requireInteraction: false,
    });
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showBreakReminder,
    showBreakTime,
    showExerciseComplete,
    showBreakComplete,
  };
}