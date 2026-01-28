import { S2SPublicationConfig } from './types';
import { S2STemplateConfig, S2SRipple } from '../rendering';
export * from './types';
/**
 * Validates the config object against its schema
 * @throws Error if config is missing or invalid
 */
export declare const validateConfig: (config: S2SPublicationConfig) => void;
/**
 * Validates the mapping object and checks if it exists in the config
 * @throws Error if mapping is missing or invalid
 */
export declare const validateMapping: (templateConfig: S2STemplateConfig, rippleConfigs: S2SRipple[]) => void;
/**
 * Validates the protocol object against its schema
 * @throws Error if protocol is invalid
 */
export declare const validateProtocol: (protocol: any) => void;
/**
 * Validates the body object against its schema
 * @throws Error if body is invalid
 */
export declare const validateBody: (body: any) => void;
//# sourceMappingURL=index.d.ts.map