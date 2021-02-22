import {Request, Response, Router} from 'express';
import {Route, RouteParam} from '../interfaces/index.js';

import {ApiPrefix} from '../enum/index.js';
import {SucessfulRouteStatus} from '../constants/index.js';
import {getControllers} from '../config/index.js';
import {transformRouteParams} from './params-handler.js';

const getRouteMethod = (key: string) => (obj: Record<string, any>) => obj[key];

/**
 * Handles the result of an Endpoint
 * When passing result as type of ApiResponse, we return its status and data
 * When no status is passed (neither ApiResponse nor res.status) we set the default
 * @param result 
 * @param res 
 * @param requestMethod 
 */
function handleResult(result: any, res: Response, requestMethod: string) {
    // When returning an ApiResponse interface, we use the status and data on it to resolve the response
    if ('status' in result && 'data' in result) {
        return res.status(result.status).send(result.data);
    }

    // If no status is set on the Response, the default one is
    if (res.statusCode) {
        return res.send(result);
    } else {
        return res.status(SucessfulRouteStatus[requestMethod]).send(result);
    }
}

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
                    // Parameters for the endpoint
                    const paramsMap = transformRouteParams(routeParams, route.methodName, req, res);

                    // Method on the controller class to be executed
                    const routeMethod = getRouteMethod(route.methodName.toString())(instance);

                    // Result for the endpoint's method
                    const result = await routeMethod.apply(Object.getPrototypeOf(instance), paramsMap);

                    return handleResult(result, res, route.requestMethod);
                } catch (error) {
                    if (res.statusCode) {
                        return res.send(error);
                    } else {
                        res.status(400);
                    }
                }
            });
        });
    });

    return router;
}
