import {
  STRATEGY_REGISTRY,
  getStrategyClass,
  getAllStrategyClasses,
} from './strategy.registry';
import { GoogleStrategy } from '../providers/google.strategy';
import { FacebookStrategy } from '../providers/facebook.strategy';

describe('StrategyRegistry', () => {
  describe('STRATEGY_REGISTRY', () => {
    it('should contain GoogleStrategy', () => {
      expect(STRATEGY_REGISTRY.google).toBe(GoogleStrategy);
    });

    it('should contain FacebookStrategy', () => {
      expect(STRATEGY_REGISTRY.facebook).toBe(FacebookStrategy);
    });

    it('should have correct number of strategies', () => {
      expect(Object.keys(STRATEGY_REGISTRY).length).toBe(2);
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

    it('should return undefined for unknown provider', () => {
      const strategy = getStrategyClass('linkedin');
      expect(strategy).toBeUndefined();
    });

    it('should be case-insensitive', () => {
      expect(getStrategyClass('GOOGLE')).toBe(GoogleStrategy);
      expect(getStrategyClass('Google')).toBe(GoogleStrategy);
      expect(getStrategyClass('google')).toBe(GoogleStrategy);
    });
  });

  describe('getAllStrategyClasses', () => {
    it('should return all strategy classes', () => {
      const strategies = getAllStrategyClasses();
      expect(strategies).toContain(GoogleStrategy);
      expect(strategies).toContain(FacebookStrategy);
      expect(strategies.length).toBe(2);
    });

    it('should return array of strategy classes', () => {
      const strategies = getAllStrategyClasses();
      expect(Array.isArray(strategies)).toBe(true);
    });
  });
});
