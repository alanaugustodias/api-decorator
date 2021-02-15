import {cosmiconfigSync} from 'cosmiconfig';
import findProjectRoot from './find-project-root.js';
import path from 'path';

let config: {
    controllers: string;
};

/**
 * Start the Config file
 */
export function initConfig() {
    const configResult = cosmiconfigSync('apidecorator').search();
    config = configResult ? configResult.config : {};
}

export function getConfig() {
    return config;
}

/**
 * Import the Controllers according to the path provided on the Config file
 */
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
