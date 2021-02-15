import {Param, RouteParam} from '../interfaces/index.js';
import {Request, Response} from 'express';

import {RouteParamType} from '../enum/index.js';

function sortByIndex(paramA: Param, paramB: Param): number {
    if (paramA.index < paramB.index) {
        return -1;
    }
    if (paramA.index > paramB.index) {
        return 1;
    }
    return 0;
}

/**
 * Map all parameters and return an array of final values for thems
 * @param {Param[]} params
 * @param {Request} req
 * @param {Response} res
 */
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

/**
 * Read params registered on Route and map them to be used on the calling of the Router's function
 * @param {Array<RouteParam>} routeParams
 * @param {string} methodName
 * @param {Request} req
 * @param {Response} res
 */
export function transformRouteParams(routeParams: Array<RouteParam>, methodName: string | symbol, req: Request, res: Response) {
    const paramsOnRoute = routeParams ? routeParams.find((routeParam) => routeParam.methodName === methodName) : null;
    let paramsList = [];
    if (paramsOnRoute?.params?.length) {
        paramsOnRoute.params.sort(sortByIndex);
        paramsList = mapParams(paramsOnRoute.params, req, res);
    }
    return paramsList;
}
