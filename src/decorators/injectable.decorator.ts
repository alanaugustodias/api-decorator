import DependencyInjector from '../utils/dependency-injector.js';

export const Injectable = (): ClassDecorator => {
    return (target: any) => {
        DependencyInjector.add({
            identifier: Symbol.for(target.name),
            service: target
        });
        return target;
    };
};
