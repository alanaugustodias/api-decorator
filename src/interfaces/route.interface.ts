import {RouteMethods, RouteParamType} from '../enum/index.js';

export interface Param {
    index: number;
    type: RouteParamType;
    pathName?: string;
}

export interface RouteParam {
    methodName: string;
    params: Param[];
}

export interface Route {
    path: string;
    requestMethod: RouteMethods;
    methodName: string;
}
