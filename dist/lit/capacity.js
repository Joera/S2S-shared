"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delegateCapacityToken = exports._mintCapacityToken = void 0;
const contracts_sdk_1 = require("@lit-protocol/contracts-sdk");
const _mintCapacityToken = async (ethersWallet, SELECTED_LIT_NETWORK) => {
    const litContracts = new contracts_sdk_1.LitContracts({
        signer: ethersWallet,
        network: SELECTED_LIT_NETWORK,
    });
    await litContracts.connect();
    const capacityTokenId = (await litContracts.mintCapacityCreditsNFT({
        requestsPerKilosecond: 100,
        daysUntilUTCMidnightExpiration: 7,
    })).capacityTokenIdStr;
    console.log("Capacity token ID:", capacityTokenId);
    return capacityTokenId;
};
exports._mintCapacityToken = _mintCapacityToken;
const delegateCapacityToken = async (ethersWallet, litNodeClient, capacityTokenId) => {
    const { capacityDelegationAuthSig } = await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersWallet,
        capacityTokenId,
        delegateeAddresses: [ethersWallet.address],
        uses: "1",
    });
    return capacityDelegationAuthSig;
};
exports.delegateCapacityToken = delegateCapacityToken;
