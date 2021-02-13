import { RouteParam } from '../interfaces/index.js';
import { RouteParamType } from '../enum/index.js';

type RouteParamBuilder = {
    type: RouteParamType,
    target: any,
    propertyKey: string,
    index: number,
    pathName?: string
};

function routeParamBuilder({
    type,
    target,
    propertyKey,
    index,
    pathName
}: RouteParamBuilder) {
    if (!Reflect.hasMetadata('routeParams', target.constructor)) {
        Reflect.defineMetadata('routeParams', [], target.constructor);
    }

    const routeParams = Reflect.getMetadata('routeParams', target.constructor) as Array<RouteParam>;
    const requestRouteParamIdx = routeParams.findIndex((route) => route.methodName === propertyKey);
    let requestRouteParam = routeParams[requestRouteParamIdx];

    if (requestRouteParam) {
        requestRouteParam.params.push({
            index,
            type,
            pathName
        });
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

    Reflect.defineMetadata('routeParams', routeParams, target.constructor);
}

export const Req = () => {
    return (target: any, propertyKey: string, index: number): void => {
        routeParamBuilder({
            type: RouteParamType.REQUEST,
            target,
            propertyKey,
            index
        });
    };
};

export const Res = () => {
    return (target: any, propertyKey: string, index: number): void => {
        routeParamBuilder({
            type: RouteParamType.RESPONSE,
            target,
            propertyKey,
            index
        });
    };
};

export const Body = () => {
    return (target: any, propertyKey: string, index: number): void => {
        routeParamBuilder({
            type: RouteParamType.BODY,
            target,
            propertyKey,
            index
        });
    };
};

export const Query = () => {
    return (target: any, propertyKey: string, index: number): void => {
        routeParamBuilder({
            type: RouteParamType.QUERY,
            target,
            propertyKey,
            index
        });
    };
};

export const Path = (pathName: string) => {
    return (target: any, propertyKey: string, index: number): void => {
        routeParamBuilder({
            type: RouteParamType.PATH,
            target,
            propertyKey,
            index,
            pathName
        });
    };
};
