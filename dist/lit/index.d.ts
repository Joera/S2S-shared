import { S2SProtocolInfo } from "../protocol";
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import type { SessionSigsMap } from '@lit-protocol/types';
export declare const createSessionSignatures: (litNodeClient: LitNodeClient, Signer: any, capacityTokenId: string) => Promise<SessionSigsMap>;
export declare const mintCapacityToken: (ethersWallet: any, SELECTED_LIT_NETWORK: any) => Promise<string>;
export declare const renderwithLitActions: (litNodeClient: LitNodeClient, sessionSignatures: SessionSigsMap, protocolInfo: S2SProtocolInfo, notice: any, authorSafeAddress: string, publication: string, contentIds: string[], update: boolean, dev: boolean, debug: boolean, configCid?: string | undefined) => Promise<any>;
//# sourceMappingURL=index.d.ts.map