import DependencyInjector from '../utils/dependency-injector.js';

export const Inject = (identifier: symbol) => {
    return (target: any, targetKey: string): void => {
        target[targetKey] = DependencyInjector.get(identifier)?.service;
    };
};
