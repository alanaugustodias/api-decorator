import 'reflect-metadata';

import {ApiPrefix, RouteMethods} from '../../enum/index.js';
import {Delete, Get, Post, Put} from '../route.decorator.js';

import {Route} from '../../interfaces/index.js';

describe('Route Decorator Tests', () => {
    it('should add a Get Route decorator to a method', () => {
        class Test {
            @Get()
            public myFunction() {}
        }

        const routes: Array<Route> = Reflect.getMetadata(ApiPrefix.ROUTES, Test);
        expect(routes.length).toBe(1);
        const route = routes[0];
        expect(route.requestMethod).toBe(RouteMethods.get);
        expect(route.methodName).toBe('myFunction');
        expect(route.path).toBe('');
    });

    it('should add a Post Route decorator to a method', () => {
        class Test {
            @Post()
            public myFunction() {}
        }

        const routes: Array<Route> = Reflect.getMetadata(ApiPrefix.ROUTES, Test);
        expect(routes.length).toBe(1);
        const route = routes[0];
        expect(route.requestMethod).toBe(RouteMethods.post);
        expect(route.methodName).toBe('myFunction');
        expect(route.path).toBe('');
    });

    it('should add a Put Route decorator to a method', () => {
        class Test {
            @Put('/my-put/')
            public myFunction() {}
        }

        const routes: Array<Route> = Reflect.getMetadata(ApiPrefix.ROUTES, Test);
        expect(routes.length).toBe(1);
        const route = routes[0];
        expect(route.requestMethod).toBe(RouteMethods.put);
        expect(route.methodName).toBe('myFunction');
        expect(route.path).toBe('/my-put');
    });

    it('should add a Delete Route decorator to a method', () => {
        class Test {
            @Delete('my-delete')
            public myFunction() {}
        }

        const routes: Array<Route> = Reflect.getMetadata(ApiPrefix.ROUTES, Test);
        expect(routes.length).toBe(1);
        const route = routes[0];
        expect(route.requestMethod).toBe(RouteMethods.delete);
        expect(route.methodName).toBe('myFunction');
        expect(route.path).toBe('/my-delete');
    });

    it('should not allow multiple Route decorators on a method', (done) => {
        try {
            class Test {
                @Delete()
                @Post()
                public myFunction() {}
            }

            process.exit(1);
        } catch (error) {
            expect(error).toBeTruthy();
            done();
        }
    });
});
