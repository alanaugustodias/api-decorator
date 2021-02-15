import {Request} from 'express';
import 'reflect-metadata';
import {RouteParamType} from '../../enum/index.js';
import {RouteParam} from '../../interfaces/index.js';

import {Req} from '../route-param.decorator.js';

describe('Route Param Decorator Tests', () => {
    it('should add a Req Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Req() req: Request) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata('routeParams', Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam).toBeTruthy();
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.REQUEST);
        expect(param?.pathName).toBeFalsy();
    });
});
