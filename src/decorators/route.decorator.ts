import {ApiPrefix, RouteMethods} from '../enum/index.js';

import {Route} from '../interfaces/index.js';
import {handlePathSlash} from '../services/path-utils.js';

type RouteBuilder = {
    path: string;
    method: RouteMethods;
    target: any;
    propertyKey: string | symbol;
};

function buildRoute({path, method, target, propertyKey}: RouteBuilder) {
    if (!Reflect.hasMetadata(ApiPrefix.ROUTES, target.constructor)) {
        Reflect.defineMetadata(ApiPrefix.ROUTES, [], target.constructor);
    }

    const routes = Reflect.getMetadata(ApiPrefix.ROUTES, target.constructor) as Array<Route>;

    const existentRoute = routes.find(({methodName}) => methodName === propertyKey);
    if (existentRoute) {
        throw new Error(
            `This method was already decorated with a ${existentRoute.requestMethod.toUpperCase()} method. Only one Route decorator is allowed per method.`
        );
    }

    routes.push({
        requestMethod: method,
        path: handlePathSlash(path),
        methodName: propertyKey
    });
    Reflect.defineMetadata(ApiPrefix.ROUTES, routes, target.constructor);
}

export const Get = (path = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        buildRoute({
            path,
            method: RouteMethods.get,
            target,
            propertyKey
        });
    };
};

export const Post = (path = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        buildRoute({
            path,
            method: RouteMethods.post,
            target,
            propertyKey
        });
    };
};

export const Put = (path = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        buildRoute({
            path,
            method: RouteMethods.put,
            target,
            propertyKey
        });
    };
};

export const Delete = (path = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        buildRoute({
            path,
            method: RouteMethods.delete,
            target,
            propertyKey
        });
    };
};
