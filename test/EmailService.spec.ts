import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import EmailService from '../src/EmailService';
import UserService from '../src/UserService';

describe('EmailService', () => {
  describe('send', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('devrait envoyer un email avec succès lorsque l\'email de l\'utilisateur existe', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const userId = 'user1';
      const emailAddress = 'user1@example.com';
      const message = 'Test message';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        email: emailAddress,
        errors: []
      });
      console.log = jest.fn();

      // test
      const promise = emailService.send(userId, message);
      jest.advanceTimersByTime(10000);
      await promise;

      // assertion
      expect(console.log).toHaveBeenCalledWith(`Email sent to ${emailAddress} with body: ${message}`);
    });

    it('devrait rejeter la promesse si l\'email de l\'utilisateur n\'est pas trouvé', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const userId = 'user2';
      const message = 'Test message';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        errors: []
      });

      // test
      const promise = emailService.send(userId, message);
      jest.advanceTimersByTime(10000);

      // assertion
      await expect(promise).rejects.toEqual('Email not found');
    });

    it('devrait rejeter la promesse si l\'utilisateur n\'existe pas', async () => {
      // fixture
      const userService = new UserService();
      const emailService = new EmailService(userService);
      const userId = 'nonexistent';
      const message = 'Test message';

      // test
      const promise = emailService.send(userId, message);
      jest.advanceTimersByTime(10000);

      // assertion
      await expect(promise).rejects.toEqual('Email not found');
    });
  });
});
