import {cosmiconfigSync} from 'cosmiconfig';
import findProjectRoot from './find-project-root.js';
import path from 'path';

let config: {
    controllers: string;
};

export function initConfig() {
    const configResult = cosmiconfigSync('apidecorator').search();
    config = configResult ? configResult.config : {};
}

export function getConfig() {
    return config;
}

export async function getControllers(): Promise<any[]> {
    const controllersPath = getConfig().controllers || '';
    if (!controllersPath) {
        return [];
    }

    const controllersRootPath = findProjectRoot(path.dirname(path.resolve(controllersPath)));
    if (!controllersRootPath) {
        return [];
    }

    const controllersImport = await import(path.join(controllersRootPath, controllersPath));
    return controllersImport || [];
}
