import 'reflect-metadata';

import DependencyInjector from '../../services/dependency-injector.js';
import {Injectable} from '../injectable.decorator.js';

describe('Injectable Decorator Tests', () => {
    it('should have a Injectable class on the Dependency Injector', () => {
        @Injectable()
        class TestService {
            getName() {
                return 'Name';
            }
        }

        const serviceInjection = DependencyInjector.get(Symbol.for('TestService'));
        expect(serviceInjection).toBeTruthy();
        expect(serviceInjection?.service).toBeTruthy();
        expect(serviceInjection?.service.getName()).toBe('Name');
    });
});
