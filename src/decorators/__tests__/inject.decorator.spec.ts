import 'reflect-metadata';

import {Inject} from '../inject.decorator.js';
import {Injectable} from '../injectable.decorator.js';

describe('Inject Decorator Tests', () => {
    it('should Inject a class using the decorator', () => {
        @Injectable()
        class TestService {
            getName() {
                return 'Name';
            }
        }

        class Test {
            @Inject(Symbol.for('TestService'))
            public serviceInjected: TestService;
        }

        const testInstance = new Test();
        expect(testInstance.serviceInjected).toBeTruthy();
        expect(testInstance.serviceInjected.getName()).toBe('Name');
    });

    it('should have null when injecting a not found class', () => {
        @Injectable()
        class TestService {
            getName() {
                return 'Name';
            }
        }

        class Test {
            @Inject(Symbol.for('OtherService'))
            public serviceInjected: TestService;
        }

        const testInstance = new Test();
        expect(testInstance.serviceInjected).toBe(null);
    });
});
