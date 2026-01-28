import * as ethers from "ethers";
import { S2SProtocolInfo } from "./types";
export { S2SProtocolInfo };
export declare const getProtocolInfo: (dev: boolean | undefined, l1Provider: ethers.Provider, l2Provider: ethers.Provider) => Promise<S2SProtocolInfo>;
export declare const tokenIDFromBytes: (bytes: string) => string;
export declare const publicKeyFromBytes: (bytes: string) => string;
export declare const addressFromBytes: (publicKeyBytes: Uint8Array | string) => string;
export declare const getRecords: (moduleAddress: string, keys: string[], ethersProvider: ethers.Provider) => Promise<any>;
export declare const getProtocolControllerAndModules: (dev: boolean, l1Provider: ethers.Provider, l2Provider: ethers.Provider) => Promise<{
    multisig: any;
    configModule: any;
    publicationModule: any;
}>;
//# sourceMappingURL=index.d.ts.map