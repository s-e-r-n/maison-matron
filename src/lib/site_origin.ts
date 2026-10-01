export const site_origin = new URL("https://www.maison-matron.ch");

export const at_origin = (path: string) => new URL(path, site_origin).href;
