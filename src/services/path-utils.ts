export function handlePathSlash(path: string): string {
    let finalPath = path;
    if (finalPath && !finalPath.startsWith('/')) {
        finalPath = `/${finalPath}`;
    }

    if (finalPath.endsWith('/')) {
        finalPath = finalPath.substring(0, finalPath.length - 1);
    }

    return finalPath;
}
