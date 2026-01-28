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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProtocolControllerAndModules = exports.getRecords = exports.addressFromBytes = exports.publicKeyFromBytes = exports.tokenIDFromBytes = exports.getProtocolInfo = void 0;
const ethers_1 = require("ethers");
const ethers = __importStar(require("ethers"));
const constants_1 = require("./constants");
const getProtocolInfo = async (dev = false, l1Provider, l2Provider) => {
    try {
        const { multisig, configModule } = await (0, exports.getProtocolControllerAndModules)(dev, l1Provider, l2Provider);
        const [assets_gateway, data_gateway, ens_records, lens_app, lit_action_prep, lit_action_single, lit_action_cbor, lit_action_root_update, pkp_tokenId, pkp_publicKey, pkp_ethAddress] = await (0, exports.getRecords)(configModule, ["assets_gateway", "data_gateway", "ens_records", "lens_app", "lit_action_prep", "lit_action_single", "lit_action_cbor", "lit_action_root_update", "pkp_tokenId", "pkp_publicKey", "pkp_ethAddress"], l2Provider);
        return {
            addr: multisig || "",
            recordsModule: configModule,
            dataGateway: data_gateway,
            assetsGateway: assets_gateway,
            lensApp: lens_app,
            ensRecords: ens_records,
            pkp: {
                ethAddress: pkp_ethAddress,
                publicKey: pkp_publicKey,
                tokenId: pkp_tokenId
            },
            litActionPrep: lit_action_prep,
            litActionCbor: lit_action_cbor,
            litActionSingle: lit_action_single,
            litActionRootUpdate: lit_action_root_update
        };
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log("Protocol info error:", errorMsg);
        throw error;
    }
};
exports.getProtocolInfo = getProtocolInfo;
const tokenIDFromBytes = (bytes) => {
    // I Doubt this can actualy be done .. and probably we wont need it anyway
    return "";
};
exports.tokenIDFromBytes = tokenIDFromBytes;
const publicKeyFromBytes = (bytes) => {
    return ethers.hexlify(bytes);
};
exports.publicKeyFromBytes = publicKeyFromBytes;
const addressFromBytes = (publicKeyBytes) => {
    const pubKeyHex = ethers.hexlify(publicKeyBytes);
    const uncompressedKey = pubKeyHex.startsWith("0x04")
        ? pubKeyHex.slice(4)
        : pubKeyHex.replace(/^0x/, "");
    const hash = ethers.keccak256("0x" + uncompressedKey);
    const rawAddress = "0x" + hash.slice(-40);
    return ethers.getAddress(rawAddress);
};
exports.addressFromBytes = addressFromBytes;
const getRecords = async (moduleAddress, keys, ethersProvider) => {
    const module = new ethers.Contract(moduleAddress, [
        { "inputs": [
                {
                    "internalType": "string[]",
                    "name": "keys",
                    "type": "string[]"
                }
            ],
            "name": "getRecords",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "values",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function" }
    ], ethersProvider);
    return await module.getRecords(keys);
};
exports.getRecords = getRecords;
const getProtocolControllerAndModules = async (dev, l1Provider, l2Provider) => {
    try {
        const ensName = dev ? "dev.soul2soul.eth" : "soul2soul.eth";
        const nameWrapper = new ethers.Contract(constants_1.ENS_NAMEWRAPPER, [
            "function ownerOf(uint256 id) view returns (address)"
        ], l1Provider);
        const subdomainNode = (0, ethers_1.namehash)(ensName);
        const customRegistryContract = await nameWrapper.ownerOf(subdomainNode);
        const registry = new ethers.Contract(customRegistryContract, [
            "function parentDomainController() view returns (address)"
        ], l1Provider);
        const controller = await registry.parentDomainController();
        const safe = new ethers.Contract(controller, [
            "function getModulesPaginated(address start, uint256 pageSize) view returns (address[] memory array, address next)"
        ], l2Provider);
        const [modules] = await safe.getModulesPaginated("0x0000000000000000000000000000000000000001", // sentinel
        10);
        let configModule = null;
        let publicationModule = null;
        for (const moduleAddress of modules) {
            try {
                const module = new ethers.Contract(moduleAddress, ["function NAME() view returns (string)"], l2Provider);
                const name = await module.NAME();
                // console.log(`Module ${moduleAddress} NAME:`, name);
                if (name === "S2S Records Module") {
                    configModule = moduleAddress;
                }
                else if (name === "S2S Publication Module") {
                    publicationModule = moduleAddress;
                }
            }
            catch (error) {
                // Module doesn't have NAME function, skip
                // console.log(`Module ${moduleAddress} has no NAME function`);
            }
        }
        return {
            multisig: controller,
            configModule,
            publicationModule
        };
    }
    catch (error) {
        console.error("Error getting publication addresses:", error);
        return {
            multisig: null,
            configModule: null,
            publicationModule: null
        };
    }
};
exports.getProtocolControllerAndModules = getProtocolControllerAndModules;
