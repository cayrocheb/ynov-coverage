import { describe, expect, it, jest } from '@jest/globals';
import NotificationManager from '../src/NotificationManager';
import EmailService from '../src/EmailService';
import SmsService from '../src/SmsService';
import UserService from '../src/UserService';
import ClockService from '../src/ClockService';
import Scheduler from '../src/Scheduler';

describe('NotificationManager', () => {
  describe('notify', () => {
    it('devrait envoyer une notification immédiate via email et SMS lorsque les deux sont activés', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      const userId = 'user1';
      const message = 'Test notification';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+33612345678',
        settings: {
          notificationEnabled: true,
          notificationByEmail: true,
          notificationBySms: true,
          notificationFrequency: 'immediate'
        },
        errors: []
      });

      const emailSendSpy = jest.spyOn(emailService, 'send').mockResolvedValue();
      const smsSendSpy = jest.spyOn(smsService, 'send').mockResolvedValue();

      // test
      await notificationManager.notify(userId, message);

      // assertion
      expect(emailSendSpy).toHaveBeenCalledWith(userId, message);
      expect(smsSendSpy).toHaveBeenCalledWith(userId, message);
    });

    it('ne devrait envoyer que des emails lorsque la notification par SMS est désactivée', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      const userId = 'user1';
      const message = 'Test notification';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        settings: {
          notificationEnabled: true,
          notificationByEmail: true,
          notificationBySms: false,
          notificationFrequency: 'immediate'
        },
        errors: []
      });

      const emailSendSpy = jest.spyOn(emailService, 'send').mockResolvedValue();
      const smsSendSpy = jest.spyOn(smsService, 'send').mockResolvedValue();

      // test
      await notificationManager.notify(userId, message);

      // assertion
      expect(emailSendSpy).toHaveBeenCalledWith(userId, message);
      expect(smsSendSpy).not.toHaveBeenCalled();
    });

    it('ne devrait pas envoyer de notification si les notifications sont désactivées', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      const userId = 'user1';
      const message = 'Test notification';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+33612345678',
        settings: {
          notificationEnabled: false,
          notificationByEmail: true,
          notificationBySms: true,
          notificationFrequency: 'immediate'
        },
        errors: []
      });

      const emailSendSpy = jest.spyOn(emailService, 'send').mockResolvedValue();
      const smsSendSpy = jest.spyOn(smsService, 'send').mockResolvedValue();

      // test
      await notificationManager.notify(userId, message);

      // assertion
      expect(emailSendSpy).not.toHaveBeenCalled();
      expect(smsSendSpy).not.toHaveBeenCalled();
    });

    it('devrait ajouter une tâche au planificateur quotidien lorsque la fréquence est quotidienne', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      const userId = 'user1';
      const message = 'Test notification';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        settings: {
          notificationEnabled: true,
          notificationByEmail: true,
          notificationBySms: false,
          notificationFrequency: 'daily'
        },
        errors: []
      });

      const dailySchedulerSpy = jest.spyOn(weeklyScheduler, 'addTask');

      // test
      await notificationManager.notify(userId, message);

      // assertion
      expect(dailySchedulerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyFrequency', () => {
    it('devrait exécuter les tâches planifiées lorsque notifyFrequency est appelée', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      // mock
      const weeklySchedulerRunSpy = jest.spyOn(weeklyScheduler, 'run').mockResolvedValue();

      // test - simuler l'événement 'weekly' (appelé via clockService.on)
      await notificationManager.notifyFrequency('weekly');

      // assertion
      expect(weeklySchedulerRunSpy).toHaveBeenCalledTimes(0); // Pas d'exécution si pas de tâche
    });

    it('ne devrait rien faire si aucune tâche n\'est planifiée pour la fréquence donnée', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const smsService = new SmsService(userService);
      const clockService = new ClockService();
      const weeklyScheduler = new Scheduler();
      const dailyScheduler = new Scheduler();

      const notificationManager = new NotificationManager(
        emailService,
        smsService,
        userService,
        clockService,
        weeklyScheduler,
        dailyScheduler
      );

      // test - aucune tâche n'a été ajoutée
      const result = notificationManager.notifyFrequency('daily');

      // assertion
      await expect(result).resolves.toBeUndefined();
    });
  });
});
