import 'reflect-metadata';
import {Request, Response} from 'express';
import {getMockReq, getMockRes} from '@jest-mock/express';
import {SucessfulRouteStatus} from '../../constants/index.js';
import {Controller, Delete, Get, Put, Req, Res} from '../../decorators/index.js';
import {RouteMethods} from '../../enum/index.js';

describe('Routes binder Tests', () => {
    let BindRoutes: any;

    @Controller('my-controller')
    class TestController {
        @Get('my-get-endpoint')
        public myGetEndpoint(@Req() req: any, @Res() res: any) {
            return {
                foo: 'bar',
            };
        }

        @Get('my-post-endpoint')
        public myPostEndpoint(@Req() req: any, @Res() res: any) {
            res.status(204);
            return req.body;
        }

        @Put('my-put-endpoint')
        public myPutEndpoint(@Req() req: any, @Res() res: any) {
            throw new Error('Error');
        }

        @Delete('my-delete-endpoint')
        public myDeleteEndpoint(@Req() req: any, @Res() res: any) {
            res.status(404);
            throw new Error('Error');
        }
    }

    beforeAll(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        jest.mock('express', () => ({
            Router: () => {
                const endpoints: any[] = [];
                const addEndpoint = (path: string, callback: () => void) => {
                    endpoints.push({
                        path,
                        callback
                    });
                };

                return {
                    endpoints,
                    get: addEndpoint,
                    post: addEndpoint,
                    put: addEndpoint,
                    delete: addEndpoint
                };
            },
        }));

        const _config = jest.mock('../../config/index.js', () => ({
            getControllers: () => [TestController],
        }));

        BindRoutes = await import('../routes-binder.js');
    });

    it('should Bind a Get Route for a Controller class', async () => {
        const routes = await BindRoutes.default();

        expect(routes.endpoints.length).toBe(4);
        const endpoint = routes.endpoints[0];
        expect(endpoint.path).toBe('/my-controller/my-get-endpoint');

        const mockRequest: Request = getMockReq();
        const mockResponse: Response = getMockRes({
            status: jest.fn(),
            send: jest.fn(),
        }).res;

        await endpoint.callback(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(SucessfulRouteStatus[RouteMethods.get]);
        expect(mockResponse.send).toHaveBeenCalledWith({
            foo: 'bar',
        });
    });

    it('should Bind a Post Route for a Controller class, with pre-set status', async () => {
        const routes = await BindRoutes.default();

        const endpoint = routes.endpoints[1];
        expect(endpoint.path).toBe('/my-controller/my-post-endpoint');

        const body = {
            foo: 'bar'
        };
        const mockRequest: Request = getMockReq({ body });
        const mockResponse: Response = getMockRes({
            status: jest.fn(),
            send: jest.fn(),
        }).res;

        await endpoint.callback(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        expect(mockResponse.send).toHaveBeenCalledWith(body);
    });

    it('should Bind a Put Route for a Controller class, and handle exception', async () => {
        const routes = await BindRoutes.default();

        const endpoint = routes.endpoints[2];
        expect(endpoint.path).toBe('/my-controller/my-put-endpoint');

        const mockRequest: Request = getMockReq();
        const mockResponse: Response = getMockRes({
            status: jest.fn(),
            send: jest.fn(),
        }).res;

        await endpoint.callback(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should Bind a Delete Route for a Controller class, and handle exception with pre-set status', async () => {
        const routes = await BindRoutes.default();

        const endpoint = routes.endpoints[3];
        expect(endpoint.path).toBe('/my-controller/my-delete-endpoint');

        const mockRequest: Request = getMockReq();
        const mockResponse: Response = getMockRes({
            status: jest.fn(),
            send: jest.fn(),
        }).res;

        await endpoint.callback(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
});
