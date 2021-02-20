import 'reflect-metadata';

import {ApiPrefix} from '../../enum/index.js';
import {Controller} from '../controller.decorator.js';

describe('Controller Decorator Tests', () => {
    it('should add a Controller decorator to a class', () => {
        @Controller('MyController/')
        class Test {}

        const prefix = Reflect.getMetadata(ApiPrefix.PREFIX, Test);
        expect(prefix).toBe('/MyController');
    });

    it('should have prefix empty if none is passed', () => {
        @Controller()
        class Test {}

        const prefix = Reflect.getMetadata(ApiPrefix.PREFIX, Test);
        expect(prefix).toBe('');
    });

    it('should not allow a class having multiple prefixes', (done) => {
        try {
            @Controller('my-path')
            @Controller()
            class Test {}

            process.exit(1);
        } catch (error) {
            expect(error).toBeTruthy();
            done();
        }
    });
});
