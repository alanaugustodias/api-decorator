import {Request, Response, Router} from 'express';
import {Route, RouteParam} from '../interfaces/index.js';

import {ApiPrefix} from '../enum/index.js';
import {SucessfulRouteStatus} from '../constants/index.js';
import {getControllers} from '../config/index.js';
import {transformRouteParams} from './params-handler.js';

const getRouteMethod = (key: string) => (obj: Record<string, any>) => obj[key];

/**
 * Bind Controllers's Routes to the Express's Routers
 */
export default async function BindRoutes(): Promise<Router> {
    const router = Router();
    const Controllers = await getControllers();
    Object.values(Controllers).forEach((Controller) => {
        const instance = new Controller();
        const prefix = Reflect.getMetadata(ApiPrefix.PREFIX, Controller);
        const routes: Array<Route> = Reflect.getMetadata(ApiPrefix.ROUTES, Controller);
        const routeParams: Array<RouteParam> = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, Controller);

        routes.forEach((route) => {
            router[route.requestMethod](prefix + route.path, async (req: Request, res: Response) => {
                try {
                    const paramsMap = transformRouteParams(routeParams, route.methodName, req, res);
                    const routeMethod = getRouteMethod(route.methodName.toString())(instance);
                    const result = await routeMethod.apply(Object.getPrototypeOf(instance), paramsMap);
                    return res.status(SucessfulRouteStatus[route.requestMethod]).send(result);
                }
                catch (error) {
                    console.error(error);
                    return res.status(400).send('The request could not be processed');
                }
            });
        });
    });

    return router;
}
