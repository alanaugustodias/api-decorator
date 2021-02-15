import DependencyInjector from '../services/dependency-injector.js';

export const Inject = (identifier: symbol): PropertyDecorator => {
    return (target: any, targetKey: string | symbol): void => {
        target[targetKey] = null;
        const injectableClassInstance = DependencyInjector.get(identifier);
        if (injectableClassInstance?.service) {
            target[targetKey] = injectableClassInstance?.service;
        }
    };
};
