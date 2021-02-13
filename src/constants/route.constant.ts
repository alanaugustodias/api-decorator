import {RouteMethods} from '../enum/index.js';

export const SucessfulRouteStatus: Record<string, number> = {
    [RouteMethods.get]: 200, // OK
    [RouteMethods.post]: 201, // Created
    [RouteMethods.put]: 200, // OK
    [RouteMethods.delete]: 204 // No Content
};
