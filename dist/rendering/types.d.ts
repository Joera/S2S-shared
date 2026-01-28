export interface S2SBody {
    id: string;
    author: string;
    content?: string;
    locale: string;
    parent: string;
    position: string;
    postType: string;
    creationDate: string;
    modifiedDate: string;
    title?: string;
    slug?: string;
    base?: string;
    custom?: any;
    publication?: string;
    tags: string[];
    attributes?: any;
}
export interface S2STemplateData {
    id: string;
    controller: string;
    tags: string[];
    parent: number;
    language: string;
    position: number;
    encrypted: string;
    postType: string;
    publications: string[];
    collections?: any;
    path: string;
    base?: string;
    custom: any;
    content: string;
    creationDate: string;
    modifiedDate: string;
}
export interface S2SCollection {
    source: string;
    query: any;
    filters: any[];
    key: string;
    value: string;
    slug: string;
}
export interface S2SRipple {
    origins: string[];
    destination: string;
    reference: string;
    query: any;
}
export interface S2STemplateConfig {
    reference: string;
    file: string;
    path: string;
    collections?: S2SCollection[];
}
export interface IMapping {
    templateConfig: S2STemplateConfig[];
    ripples: S2SRipple[];
}
export interface S2SJob {
    id: string;
    templateConfig: S2STemplateConfig;
    path?: string;
    templateData?: S2STemplateData;
    html?: string;
    revoked?: boolean;
}
//# sourceMappingURL=types.d.ts.map