import 'reflect-metadata';
import {Request, Response} from 'express';
import {ApiPrefix, RouteParamType} from '../../enum/index.js';
import {RouteParam} from '../../interfaces/index.js';
import {Body, Path, Query, Req, Res} from '../route-param.decorator.js';

describe('Route Param Decorator Tests', () => {
    it('should add a Request Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Req() req: Request) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.REQUEST);
        expect(param?.pathName).toBeFalsy();
    });

    it('should add a Response Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Res() res: Response) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.RESPONSE);
        expect(param?.pathName).toBeFalsy();
    });

    it('should add a Body Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Body() body: any) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.BODY);
        expect(param?.pathName).toBeFalsy();
    });

    it('should add a Query Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Query() query: any) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.QUERY);
        expect(param?.pathName).toBeFalsy();
    });

    it('should add a Path Route Param decorator to a method', () => {
        class Test {
            public myFunction(@Path('myParam') param: string) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(1);
        const param = routeParam?.params[0];
        expect(param?.index).toBe(0);
        expect(param?.type).toBe(RouteParamType.PATH);
        expect(param?.pathName).toBe('myParam');
    });

    it('should add multiple Route Param decorators to a method', () => {
        class Test {
            public myFunction(
                @Path('myParam') param: string,
                @Query() query: any,
                @Req() req: Request,
                @Body() body: any,
                @Res() res: Response,
            ) {}
        }

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        expect(routeParams.length).toBe(1);
        const routeParam = routeParams.find(({methodName}) => methodName === 'myFunction');
        expect(routeParam?.params.length).toBe(5);

        const pathParam = routeParam?.params[0];
        expect(pathParam?.index).toBe(0);
        expect(pathParam?.type).toBe(RouteParamType.PATH);
        expect(pathParam?.pathName).toBe('myParam');

        const queryParam = routeParam?.params[1];
        expect(queryParam?.index).toBe(1);
        expect(queryParam?.type).toBe(RouteParamType.QUERY);
        expect(queryParam?.pathName).toBeFalsy();

        const reqParam = routeParam?.params[2];
        expect(reqParam?.index).toBe(2);
        expect(reqParam?.type).toBe(RouteParamType.REQUEST);
        expect(reqParam?.pathName).toBeFalsy();

        const bodyParam = routeParam?.params[3];
        expect(bodyParam?.index).toBe(3);
        expect(bodyParam?.type).toBe(RouteParamType.BODY);
        expect(bodyParam?.pathName).toBeFalsy();

        const resParam = routeParam?.params[4];
        expect(resParam?.index).toBe(4);
        expect(resParam?.type).toBe(RouteParamType.RESPONSE);
        expect(resParam?.pathName).toBeFalsy();
    });
});
