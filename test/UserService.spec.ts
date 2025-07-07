import { describe, expect, it } from '@jest/globals';
import UserService, { Settings } from '../src/UserService';

describe('UserService', () => {
  describe('addUser', () => {
    it('devrait ajouter un utilisateur correctement', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+33612345678',
        errors: []
      };

      // test
      userService.addUser(user);

      // assertion
      expect(userService.getUserEmail('user1')).toBe('test@example.com');
      expect(userService.getUserPhoneNumber('user1')).toBe('+33612345678');
    });
  });

  describe('getUserPhoneNumber', () => {
    it('devrait retourner le numéro de téléphone lorsque l\'utilisateur existe', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        phone: '+33612345678',
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserPhoneNumber('user1');

      // assertion
      expect(result).toBe('+33612345678');
    });

    it('devrait retourner null si l\'utilisateur n\'a pas de numéro de téléphone', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserPhoneNumber('user1');

      // assertion
      expect(result).toBeNull();
    });

    it('devrait retourner null si l\'utilisateur n\'existe pas', () => {
      // fixture
      const userService = new UserService();

      // test
      const result = userService.getUserPhoneNumber('nonexistent');

      // assertion
      expect(result).toBeNull();
    });
  });

  describe('getUserEmail', () => {
    it('devrait retourner l\'email lorsque l\'utilisateur existe', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserEmail('user1');

      // assertion
      expect(result).toBe('test@example.com');
    });

    it('devrait retourner null si l\'utilisateur n\'a pas d\'email', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserEmail('user1');

      // assertion
      expect(result).toBeNull();
    });

    it('devrait retourner null si l\'utilisateur n\'existe pas', () => {
      // fixture
      const userService = new UserService();

      // test
      const result = userService.getUserEmail('nonexistent');

      // assertion
      expect(result).toBeNull();
    });
  });

  describe('getUserSettings', () => {
    it('devrait retourner les paramètres lorsque l\'utilisateur existe avec des paramètres', () => {
      // fixture
      const userService = new UserService();
      const settings: Settings = {
        notificationEnabled: true,
        notificationByEmail: true,
        notificationBySms: true,
        notificationFrequency: 'weekly'
      };
      const user = {
        id: 'user1',
        name: 'Test User',
        settings,
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserSettings('user1');

      // assertion
      expect(result).toEqual(settings);
    });

    it('devrait retourner les paramètres par défaut si l\'utilisateur n\'a pas de paramètres définis', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        errors: []
      };
      userService.addUser(user);

      // test
      const result = userService.getUserSettings('user1');

      // assertion
      expect(result).toEqual({
        notificationEnabled: true,
        notificationByEmail: true,
        notificationBySms: false,
        notificationFrequency: 'immediate'
      });
    });

    it('devrait retourner null si l\'utilisateur n\'existe pas', () => {
      // fixture
      const userService = new UserService();

      // test
      const result = userService.getUserSettings('nonexistent');

      // assertion
      expect(result).toBeNull();
    });
  });

  describe('cannotSendNotification', () => {
    it('devrait ajouter une erreur à la liste des erreurs de l\'utilisateur', () => {
      // fixture
      const userService = new UserService();
      const user = {
        id: 'user1',
        name: 'Test User',
        errors: []
      };
      userService.addUser(user);

      // test
      userService.cannotSendNotification({ userId: 'user1', error: 'Test error' });

      // assertion - nous devons accéder directement à la propriété users qui est privée
      // ceci est pour des besoins de test uniquement
      const userWithErrors = (userService as any).users['user1'];
      expect(userWithErrors.errors).toContain('Test error');
    });

    it('ne devrait rien faire si l\'utilisateur n\'existe pas', () => {
      // fixture
      const userService = new UserService();

      // test - ne devrait pas lancer d'erreur
      const action = () => userService.cannotSendNotification({ userId: 'nonexistent', error: 'Test error' });

      // assertion
      expect(action).not.toThrow();
    });
  });
});
