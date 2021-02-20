import {ApiPrefix, RouteParamType} from '../enum/index.js';

import {RouteParam} from '../interfaces/index.js';

type RouteParamBuilder = {
    type: RouteParamType;
    target: any;
    propertyKey: string | symbol;
    index: number;
    pathName?: string;
};

function buildRouteParam({type, target, propertyKey, index, pathName}: RouteParamBuilder) {
    if (!Reflect.hasMetadata(ApiPrefix.ROUTE_PARAMS, target.constructor)) {
        Reflect.defineMetadata(ApiPrefix.ROUTE_PARAMS, [], target.constructor);
    }

    const routeParams = Reflect.getMetadata(ApiPrefix.ROUTE_PARAMS, target.constructor) as Array<RouteParam>;
    const requestRouteParamIdx = routeParams.findIndex((route) => route.methodName === propertyKey);
    let requestRouteParam = routeParams[requestRouteParamIdx];

    if (requestRouteParam) {
        requestRouteParam.params.push({
            index,
            type,
            pathName
        });

        requestRouteParam.params.sort(({index: indexA}, {index: indexB}) => indexA - indexB);
        routeParams[requestRouteParamIdx] = requestRouteParam;
    }
    else {
        requestRouteParam = {
            methodName: propertyKey,
            params: [
                {
                    index,
                    type,
                    pathName
                }
            ]
        };
        routeParams.push(requestRouteParam);
    }

    Reflect.defineMetadata(ApiPrefix.ROUTE_PARAMS, routeParams, target.constructor);
}

export const Req = (): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, index: number): void => {
        buildRouteParam({
            type: RouteParamType.REQUEST,
            target,
            propertyKey,
            index
        });
    };
};

export const Res = (): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, index: number): void => {
        buildRouteParam({
            type: RouteParamType.RESPONSE,
            target,
            propertyKey,
            index
        });
    };
};

export const Body = (): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, index: number): void => {
        buildRouteParam({
            type: RouteParamType.BODY,
            target,
            propertyKey,
            index
        });
    };
};

export const Query = (): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, index: number): void => {
        buildRouteParam({
            type: RouteParamType.QUERY,
            target,
            propertyKey,
            index
        });
    };
};

export const Path = (pathName: string): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, index: number): void => {
        buildRouteParam({
            type: RouteParamType.PATH,
            target,
            propertyKey,
            index,
            pathName
        });
    };
};
