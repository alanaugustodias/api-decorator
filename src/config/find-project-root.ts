// Simple version of `find-project-root`
// https://github.com/kirstein/find-project-root/blob/master/index.js

import fs from 'fs';
import path from 'path';

const MARKERS = ['.git', '.hg'];

function markerExists(files: string[]) {
    return MARKERS.some(function (marker) {
        return files.some(function (file) {
            return file === marker;
        });
    });
}

function traverseFolder(directory: string, levels: number): string | null {
    const files = fs.readdirSync(directory);
    if (levels === 0) {
        return null;
    }
    else if (markerExists(files)) {
        return directory;
    }
    else {
        return traverseFolder(path.resolve(directory, '..'), levels - 1);
    }
}

function findProjectRoot(directory: string): string | null {
    if (!directory) {
        throw new Error('Directory not defined');
    }
    const levels = 9;
    return traverseFolder(directory, levels);
}

export default findProjectRoot;
