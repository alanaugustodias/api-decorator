import {ApiPrefix} from '../enum/index.js';
import {handlePathSlash} from '../services/path-utils.js';

export const Controller = (prefix = ''): ClassDecorator => {
    return (target: any) => {
        const existentPrefix = Reflect.getMetadata(ApiPrefix.PREFIX, target);
        if (existentPrefix !== undefined && existentPrefix !== null) {
            throw new Error(
                `This class was already declared with a route prefix: '${existentPrefix}'. Only one Route prefix is allowed per class.`
            );
        }

        Reflect.defineMetadata(ApiPrefix.PREFIX, handlePathSlash(prefix), target);
    };
};
