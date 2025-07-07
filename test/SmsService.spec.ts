import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import SmsService from '../src/SmsService';
import UserService from '../src/UserService';

describe('SmsService', () => {
  describe('send', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('devrait envoyer un SMS avec succès lorsque le numéro de téléphone de l\'utilisateur existe', async () => {
      // fixture
      const userService = new UserService();
      const smsService = new SmsService(userService);
      const userId = 'user1';
      const phoneNumber = '+33612345678';
      const message = 'Test message';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        phone: phoneNumber,
        errors: []
      });
      console.log = jest.fn();

      // test
      const promise = smsService.send(userId, message);
      jest.advanceTimersByTime(10000);
      await promise;

      // assertion
      expect(console.log).toHaveBeenCalledWith(`SMS sent to ${phoneNumber} with message: ${message}`);
    });

    it('devrait rejeter la promesse si le numéro de téléphone de l\'utilisateur n\'est pas trouvé', async () => {
      // fixture
      const userService = new UserService();
      const smsService = new SmsService(userService);
      const userId = 'user2';
      const message = 'Test message';

      // mock
      userService.addUser({
        id: userId,
        name: 'Test User',
        errors: []
      });

      // test
      const promise = smsService.send(userId, message);
      jest.advanceTimersByTime(10000);

      // assertion
      await expect(promise).rejects.toEqual('phone number not found');
    });

    it('devrait rejeter la promesse si l\'utilisateur n\'existe pas', async () => {
      // fixture
      const userService = new UserService();
      const smsService = new SmsService(userService);
      const userId = 'nonexistent';
      const message = 'Test message';

      // test
      const promise = smsService.send(userId, message);
      jest.advanceTimersByTime(10000);

      // assertion
      await expect(promise).rejects.toEqual('phone number not found');
    });
  });
});
