import {Param, Route, RouteParam} from '../interfaces/index.js';
import {Request, Response, Router} from 'express';

import {RouteParamType} from '../enum/index.js';
import {SucessfulRouteStatus} from '../constants/index.js';
import {getControllers} from '../config/index.js';

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

function mapParams(params: Param[], req: Request, res: Response): any[] {
    return params.map(({type, pathName}): any => {
        if (type === RouteParamType.PATH) {
            return pathName ? req.params[pathName] : null;
        }

        const routeParams = {
            [RouteParamType.REQUEST]: req,
            [RouteParamType.RESPONSE]: res,
            [RouteParamType.BODY]: req.body,
            [RouteParamType.QUERY]: req.query,
        };

        return routeParams[type];
    });
}

function sortByIndex(paramA: Param, paramB: Param): number {
    if (paramA.index < paramB.index) {
        return -1;
    }
    if (paramA.index > paramB.index) {
        return 1;
    }
    return 0;
}

export default async function BindRoutes(): Promise<Router> {
    const router = Router();
    const Controllers = await getControllers();
    Object.values(Controllers).forEach((Controller) => {
        const instance = new Controller();
        const prefix = Reflect.getMetadata('prefix', Controller);
        const routes: Array<Route> = Reflect.getMetadata('routes', Controller);
        const routeParams: Array<RouteParam> = Reflect.getMetadata('routeParams', Controller);

        routes.forEach((route) => {
            router[route.requestMethod](prefix + route.path, async (req: Request, res: Response) => {
                const paramsOnRoute = routeParams
                    ? routeParams.find(({methodName}) => methodName === route.methodName)
                    : null;

                let paramsMapper = [];
                if (paramsOnRoute?.params?.length) {
                    paramsOnRoute.params.sort(sortByIndex);
                    paramsMapper = mapParams(paramsOnRoute.params, req, res);
                }

                try {
                    const routeMethod = getKeyValue(route.methodName)(instance);
                    const result = await routeMethod.apply(Object.getPrototypeOf(instance), paramsMapper);
                    return res.status(SucessfulRouteStatus[route.requestMethod]).send(result);
                } catch (error) {
                    console.error(error);
                    return res.status(400).send('The request could not be processed');
                }
            });
        });
    });

    return router;
}
