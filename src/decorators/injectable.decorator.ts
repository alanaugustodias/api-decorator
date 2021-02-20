import DependencyInjector from '../services/dependency-injector.js';

export const Injectable = (): ClassDecorator => {
    return (target: any): void => {
        DependencyInjector.add({
            identifier: Symbol.for(target.name),
            service: target
        });
    };
};
