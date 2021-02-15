import {initConfig} from './config/index.js';
initConfig();

export * from './decorators/index.js';
export * from './interfaces/index.js';
export {default as BindRoutes} from './services/routes-binder.js';
