import 'reflect-metadata';
import {Request, Response} from 'express';
import {getMockReq, getMockRes} from '@jest-mock/express';
import {SucessfulRouteStatus} from '../../constants/index.js';
import {Controller, Get, Req, Res} from '../../decorators/index.js';
import {RouteMethods} from '../../enum/index.js';

describe('Routes binder Tests', () => {
    let BindRoutes: any;

    async function createMocks(Controller: any) {
        const _config = jest.mock('../../config/index.js', () => ({
            getControllers: () => [Controller],
        }));
        BindRoutes = await import('../routes-binder.js');
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();

        jest.mock('express', () => ({
            Router: () => {
                const endpoints: any[] = [];
                const addEndpoint = (path: string, callback: () => void) => {
                    endpoints.push({
                        path,
                        callback,
                    });
                };

                return {
                    endpoints,
                    get: addEndpoint,
                    post: addEndpoint,
                    put: addEndpoint,
                    delete: addEndpoint,
                };
            },
        }));
    });

    it('should Bind a Get Route for a Controller class', async () => {
        @Controller('my-controller')
        class GetController {
            @Get('my-get-endpoint')
            public myEndpoint(@Req() req: any, @Res() res: any) {
                return {
                    foo: 'bar',
                };
            }
        }

        await createMocks(GetController);

        const routes = await BindRoutes.default();

        expect(routes.endpoints.length).toBe(1);
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
});
