import 'reflect-metadata';
import {Request, Response} from 'express';
import {getMockReq, getMockRes} from '@jest-mock/express';
import {Controller, Get, Body, Req, Res, Query, Path} from '../../decorators/index.js';
import {ApiPrefix} from '../../enum/index.js';
import {RouteParam} from '../../interfaces/index.js';
import {transformRouteParams} from '../params-handler.js';

describe('Params handler Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should map Body parameter for a Route method', () => {
        @Controller()
        class Test {
            @Get()
            public myEndpoint(@Body() body: any) {}
        }

        const body = {
            firstName: 'J',
            lastName: 'Doe',
            email: 'jdoe@abc123.com',
            password: 'Abcd1234',
            passwordConfirm: 'Abcd1234',
            company: 'ABC Inc.',
        };
        const mockRequest: Request = getMockReq({
            body,
        });

        const mockResponse: Response = getMockRes().res;

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        const params = transformRouteParams(routeParams, 'myEndpoint', mockRequest, mockResponse);
        expect(params.length).toBe(1);
        const param = params[0];
        expect(param).toStrictEqual(body);
    });

    it('should map Query parameter for a Route method', () => {
        @Controller()
        class Test {
            @Get()
            public myEndpoint(@Query() query: any) {}
        }

        const query = {
            firstName: 'J',
        };
        const mockRequest: Request = getMockReq({
            query,
        });

        const mockResponse: Response = getMockRes().res;

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        const params = transformRouteParams(routeParams, 'myEndpoint', mockRequest, mockResponse);
        expect(params.length).toBe(1);
        const param = params[0];
        expect(param).toStrictEqual(query);
    });

    it('should map Path parameter for a Route method', () => {
        @Controller()
        class Test {
            @Get()
            public myEndpoint(@Path('id') id: string) {}
        }

        const path = {
            id: 'J',
        };
        const mockRequest: Request = getMockReq({
            params: path,
        });

        const mockResponse: Response = getMockRes().res;

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        const params = transformRouteParams(routeParams, 'myEndpoint', mockRequest, mockResponse);
        expect(params.length).toBe(1);
        const param = params[0];
        expect(param).toStrictEqual(path.id);
    });

    it('should map Req parameter for a Route method', () => {
        @Controller()
        class Test {
            @Get()
            public myEndpoint(@Req() req: Request) {}
        }

        const mockRequest: Request = getMockReq();
        const mockResponse: Response = getMockRes().res;

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        const params = transformRouteParams(routeParams, 'myEndpoint', mockRequest, mockResponse);
        expect(params.length).toBe(1);
        const param = params[0];
        expect(param).toStrictEqual(mockRequest);
    });

    it('should map Res parameter for a Route method', () => {
        @Controller()
        class Test {
            @Get()
            public myEndpoint(@Res() res: Response) {}
        }

        const mockRequest: Request = getMockReq();
        const mockResponse: Response = getMockRes().res;

        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Test);
        const params = transformRouteParams(routeParams, 'myEndpoint', mockRequest, mockResponse);
        expect(params.length).toBe(1);
        const param = params[0];
        expect(param).toStrictEqual(mockResponse);
    });
});
