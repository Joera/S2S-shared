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
exports.getContractAddressFromEnsName = void 0;
const abi_1 = require("./abi");
const ethers = __importStar(require("ethers"));
const ENSREGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const getContractAddressFromEnsName = async (ensName, ethersV6Provider) => {
    try {
        const node = ethers.namehash(ensName);
        // const ensProvider = new ethers.JsonRpcProvider(
        //   `https://eth-sepolia.g.alchemy.com/v2/${alchemy_key}`,
        //   { chainId: 11155111, name: "sepolia" },
        // );
        const registry = new ethers.Contract(ENSREGISTRY, abi_1.ensRegistryABI, ethersV6Provider);
        const resolverAddress = await registry.resolver(node);
        const resolver = new ethers.Contract(resolverAddress, abi_1.resolverABI, ethersV6Provider);
        return await resolver.text(node, "contract.address");
    }
    catch (error) {
        console.error("Error getting contract address:", error);
        return "false";
    }
};
exports.getContractAddressFromEnsName = getContractAddressFromEnsName;
