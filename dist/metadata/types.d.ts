export interface S2SContentInfo {
    author?: {
        lens: string;
        address: string;
        createdAt?: string;
    };
    publisher?: {
        ens: string;
        safe: string;
        url: string;
    };
    contentCid?: string;
    licenseContract?: string;
    isBasedOn?: {
        lensPublicationId: string;
        contentHash: string;
        timestamp: string;
    };
}
//# sourceMappingURL=types.d.ts.map