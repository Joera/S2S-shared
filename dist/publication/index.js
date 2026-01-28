"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.validateProtocol = exports.validateMapping = exports.validateConfig = void 0;
const zod_1 = require("zod");
__exportStar(require("./types"), exports);
// ============================================================================
// Body Schema
// ============================================================================
const bodySchema = zod_1.z.object({
    // Lens fields
    id: zod_1.z.string(), // Lens post ID (big number as string)
    author: zod_1.z.string(), // Ethereum address
    content: zod_1.z.string(), // JSON string containing encrypted data
    locale: zod_1.z.string(), // language code
    // S2S attributes (nested object)
    attributes: zod_1.z.object({
        parent: zod_1.z.string(), // stored as string in Lens
        position: zod_1.z.string(), // stored as string in Lens
        postType: zod_1.z.string(),
        creationDate: zod_1.z.string(), // Unix timestamp as string
        modifiedDate: zod_1.z.string() // Unix timestamp as string
    }),
    // Tags
    tags: zod_1.z.array(zod_1.z.string())
});
// ============================================================================
// Mapping Schemas
// ============================================================================
const querySchema = zod_1.z.object({
    method: zod_1.z.string(),
    args: zod_1.z.any()
});
const rippleSchema = zod_1.z.object({
    origins: zod_1.z.array(zod_1.z.string()),
    destination: zod_1.z.string(),
    reference: zod_1.z.string(),
    query: querySchema,
    filters: zod_1.z.array(zod_1.z.any()).optional(),
});
const assetSchema = zod_1.z.object({
    path: zod_1.z.string(),
    cid: zod_1.z.string()
});
const collectionSchema = zod_1.z.object({
    source: zod_1.z.string(),
    query: querySchema,
    filters: zod_1.z.array(zod_1.z.any()), // ✅ Already optional
    key: zod_1.z.string(),
    value: zod_1.z.string(),
    slug: zod_1.z.string()
});
const templateConfigSchema = zod_1.z.object({
    reference: zod_1.z.string(),
    file: zod_1.z.string(),
    path: zod_1.z.string(),
    collections: zod_1.z.array(collectionSchema).optional(),
    filters: zod_1.z.array(zod_1.z.any()).optional() // ✅ ADD THIS - top-level filters
});
const mappingSchema = zod_1.z.object({
    templateConfig: zod_1.z.array(templateConfigSchema), // ✅ This is correct
    ripples: zod_1.z.array(rippleSchema)
});
const publicationConfigSchema = zod_1.z.object({
    assets: zod_1.z.array(assetSchema),
    assetsGateway: zod_1.z.string(),
    contract: zod_1.z.string(),
    dataGateway: zod_1.z.string(),
    mapping: mappingSchema, // ✅ Single object (not array)
    name: zod_1.z.string(),
    renderAction: zod_1.z.string().optional(),
    stylesheets: zod_1.z.array(assetSchema).optional(),
    templateCid: zod_1.z.string(),
    // templates: z.array(templateConfigSchema)  // ← WAIT, this is confusing!
    // Do you have BOTH mapping.templateConfig AND templates?
}).passthrough();
const jobSchema = zod_1.z.object({
    templateConfig: templateConfigSchema,
    path: zod_1.z.string().optional(),
    templateData: zod_1.z.any(),
    html: zod_1.z.string()
});
// ============================================================================
// Protocol Schemas
// ============================================================================
// const protocolConfigSchema = z.object({
//     chain_id: z.number(),
//     db_model: z.string(),
//     db_context: z.string(),
//     db_gateway: z.string(),
//     rpc_url: z.string(),
//     data_gateway: z.string(),
//     assets_gateway: z.string()
// });
const pkpSchema = zod_1.z.object({
    ethAddress: zod_1.z.string(),
    publicKey: zod_1.z.string(),
    tokenId: zod_1.z.string()
});
const protocolSchema = zod_1.z.object({
    addr: zod_1.z.string(),
    recordsModule: zod_1.z.string(),
    dataGateway: zod_1.z.string(),
    assetsGateway: zod_1.z.string(),
    lensApp: zod_1.z.string(),
    ensRecords: zod_1.z.string(),
    pkp: pkpSchema,
    litActionPrep: zod_1.z.string(),
    litActionSingle: zod_1.z.string(),
    litActionCbor: zod_1.z.string(),
    litActionRootUpdate: zod_1.z.string()
});
// ============================================================================
// Config Schemas
// ============================================================================
// ============================================================================
// Validation Functions
// ============================================================================
/**
 * Validates the config object against its schema
 * @throws Error if config is missing or invalid
 */
const validateConfig = (config) => {
    if (!config) {
        throw new Error('Config is required');
    }
    try {
        publicationConfigSchema.parse(config);
        console.log('Config validation successful');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
            console.error('Config validation failed:', issues);
            throw new Error(`Invalid config structure:\n${issues}`);
        }
        throw error;
    }
};
exports.validateConfig = validateConfig;
/**
 * Validates the mapping object and checks if it exists in the config
 * @throws Error if mapping is missing or invalid
 */
const validateMapping = (templateConfig, rippleConfigs) => {
    if (!templateConfig) {
        throw new Error('Template config is required');
    }
    try {
        templateConfigSchema.parse(templateConfig);
        zod_1.z.array(rippleSchema).parse(rippleConfigs);
        // console.log('Template config and ripple configs validation successful');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
            console.error('Template config validation failed:', issues);
            throw new Error(`Invalid template config structure:\n${issues}`);
        }
        throw error;
    }
};
exports.validateMapping = validateMapping;
/**
 * Validates the protocol object against its schema
 * @throws Error if protocol is invalid
 */
const validateProtocol = (protocol) => {
    try {
        protocolSchema.parse(protocol);
        // console.log('Protocol validation successful');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
            console.error('Protocol validation failed:', issues);
            throw new Error(`Invalid protocol structure:\n${issues}`);
        }
        throw error;
    }
};
exports.validateProtocol = validateProtocol;
/**
 * Validates the body object against its schema
 * @throws Error if body is invalid
 */
const validateBody = (body) => {
    try {
        bodySchema.parse(body);
        // console.log('Body validation successful');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
            console.error('Body validation failed:', issues);
            throw new Error(`Invalid body structure:\n${issues}`);
        }
        throw error;
    }
};
exports.validateBody = validateBody;
