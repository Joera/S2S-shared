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
exports.canRead = exports.encryptContent = void 0;
const ethers = __importStar(require("ethers"));
const encryptContent = async (oxoCtrlr, streamId, dealsModule, toEncrypt) => {
    const unifiedControlConditions = (0, exports.canRead)(streamId, ethers.getAddress(oxoCtrlr.user.safe), ethers.getAddress(dealsModule));
    // console.log(JSON.stringify(unifiedControlConditions));
    return JSON.stringify(await oxoCtrlr.lit.encryptWithUcc(JSON.stringify(toEncrypt), unifiedControlConditions));
};
exports.encryptContent = encryptContent;
const canRead = (stream_id, safeAddress, dealsModule) => [
    {
        conditionType: "evmContract",
        contractAddress: dealsModule, // publicationModule
        functionName: "canPublish",
        functionParams: [safeAddress],
        functionAbi: {
            name: "canPublish",
            inputs: [{ name: "_author", type: "address" }],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
        },
        chain: "base",
        returnValueTest: {
            key: "",
            comparator: "=",
            value: "true",
        }
    },
    { operator: "and" },
    {
        conditionType: "evmContract",
        contractAddress: safeAddress,
        functionName: "isOwner",
        functionParams: [":userAddress"],
        functionAbi: {
            name: "isOwner",
            inputs: [{ name: "owner", type: "address" }],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
        },
        chain: "base",
        returnValueTest: {
            key: "",
            comparator: "=",
            value: "true",
        },
    },
    { operator: "and" },
    {
        conditionType: "evmContract",
        contractAddress: dealsModule, // publicationModule
        functionName: "hasDeal",
        functionParams: [stream_id],
        functionAbi: {
            name: "hasDeal",
            inputs: [{ name: "stream_id", type: "string" }],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
        },
        chain: "base",
        returnValueTest: {
            key: "",
            comparator: "=",
            value: "true",
        },
    },
];
exports.canRead = canRead;
