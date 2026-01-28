import type { FragmentOf } from "@lens-protocol/client";
declare const S2SContentFragment: any;
declare module "@lens-protocol/client" {
    type S2SContent = FragmentOf<typeof S2SContentFragment>;
}
export declare const postToLens: (user: any, lens: any, item: any, publicationFeed: string) => Promise<any>;
export declare const updateToLens: (user: any, lens: any, item: any, streamId: string) => Promise<any>;
export declare const fetchAuthorInfo: (lensId: string) => Promise<{
    lens: any;
    address: any;
    createdAt: any;
}>;
export {};
//# sourceMappingURL=index.d.ts.map