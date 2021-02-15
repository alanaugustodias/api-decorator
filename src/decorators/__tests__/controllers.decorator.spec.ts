import 'reflect-metadata';

import {Controller} from '../controller.decorator.js';

describe('Controller Decorator Tests', () => {
    it('should add a Controller decorator to a class', () => {
        @Controller('MyController')
        class Test {}

        const prefix = Reflect.getMetadata('prefix', Test);
        const routes = Reflect.getMetadata('routes', Test);
        expect(prefix).toBe('MyController');
        expect(routes).toStrictEqual([]);
    });

    it('should have prefix empty if none is passed', () => {
        @Controller()
        class Test {}

        const prefix = Reflect.getMetadata('prefix', Test);
        const routes = Reflect.getMetadata('routes', Test);
        expect(prefix).toBe('');
        expect(routes).toStrictEqual([]);
    });
});
