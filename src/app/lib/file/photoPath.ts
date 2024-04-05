import { URL } from 'url';

const parsedURL = (url: string): string => {
    const parsedUrl = new URL(url);
    let path = parsedUrl.pathname;

    // Convert forward slashes to backslashes
    path = path.replace(/\//g, "\\");

    // Remove leading backslash
    if (path.startsWith("\\")) {
        path = path.substring(1);
    }

    return path;
}

export default parsedURL;
