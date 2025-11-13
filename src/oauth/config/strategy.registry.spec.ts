import {
  STRATEGY_REGISTRY,
  getStrategyClass,
  getAllStrategyClasses,
} from './strategy.registry';
import { GoogleStrategy } from '../providers/google.strategy';
import { FacebookStrategy } from '../providers/facebook.strategy';
import { LinkedInStrategy } from '../providers/linkedin.strategy';
import { AppleStrategy } from '../providers/apple.strategy';

describe('StrategyRegistry', () => {
  describe('STRATEGY_REGISTRY', () => {
    it('should contain GoogleStrategy', () => {
      expect(STRATEGY_REGISTRY.google).toBe(GoogleStrategy);
    });

    it('should contain FacebookStrategy', () => {
      expect(STRATEGY_REGISTRY.facebook).toBe(FacebookStrategy);
    });

    it('should contain LinkedInStrategy', () => {
      expect(STRATEGY_REGISTRY.linkedin).toBe(LinkedInStrategy);
    });

    it('should contain AppleStrategy', () => {
      expect(STRATEGY_REGISTRY.apple).toBe(AppleStrategy);
    });

    it('should have correct number of strategies', () => {
      expect(Object.keys(STRATEGY_REGISTRY).length).toBe(4);
    });
  });

  describe('getStrategyClass', () => {
    it('should return GoogleStrategy for google provider', () => {
      const strategy = getStrategyClass('google');
      expect(strategy).toBe(GoogleStrategy);
    });

    it('should return FacebookStrategy for facebook provider', () => {
      const strategy = getStrategyClass('facebook');
      expect(strategy).toBe(FacebookStrategy);
    });

    it('should return LinkedInStrategy for linkedin provider', () => {
      const strategy = getStrategyClass('linkedin');
      expect(strategy).toBe(LinkedInStrategy);
    });

    it('should return AppleStrategy for apple provider', () => {
      const strategy = getStrategyClass('apple');
      expect(strategy).toBe(AppleStrategy);
    });

    it('should return undefined for unknown provider', () => {
      const strategy = getStrategyClass('twitter');
      expect(strategy).toBeUndefined();
    });

    it('should be case-insensitive', () => {
      expect(getStrategyClass('GOOGLE')).toBe(GoogleStrategy);
      expect(getStrategyClass('Google')).toBe(GoogleStrategy);
      expect(getStrategyClass('google')).toBe(GoogleStrategy);
      expect(getStrategyClass('LINKEDIN')).toBe(LinkedInStrategy);
      expect(getStrategyClass('LinkedIn')).toBe(LinkedInStrategy);
      expect(getStrategyClass('linkedin')).toBe(LinkedInStrategy);
      expect(getStrategyClass('APPLE')).toBe(AppleStrategy);
      expect(getStrategyClass('Apple')).toBe(AppleStrategy);
      expect(getStrategyClass('apple')).toBe(AppleStrategy);
    });
  });

  describe('getAllStrategyClasses', () => {
    it('should return all strategy classes', () => {
      const strategies = getAllStrategyClasses();
      expect(strategies).toContain(GoogleStrategy);
      expect(strategies).toContain(FacebookStrategy);
      expect(strategies).toContain(LinkedInStrategy);
      expect(strategies).toContain(AppleStrategy);
      expect(strategies.length).toBe(4);
    });

    it('should return array of strategy classes', () => {
      const strategies = getAllStrategyClasses();
      expect(Array.isArray(strategies)).toBe(true);
    });
  });
});
