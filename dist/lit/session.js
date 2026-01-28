"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._createSessionSignatures = void 0;
const auth_helpers_1 = require("@lit-protocol/auth-helpers");
const constants_1 = require("@lit-protocol/constants");
const capacity_1 = require("./capacity");
const _createSessionSignatures = async (client, signer, capacityTokenId) => {
    const capacityDelegationAuthSig = await (0, capacity_1.delegateCapacityToken)(signer, client, capacityTokenId);
    const resourceAbilityRequests = [
        {
            resource: new auth_helpers_1.LitPKPResource("*"),
            ability: constants_1.LIT_ABILITY.PKPSigning,
        },
        {
            resource: new auth_helpers_1.LitActionResource("*"),
            ability: constants_1.LIT_ABILITY.LitActionExecution,
        },
    ];
    const sigs = await client.getSessionSigs({
        chain: "ethereum",
        capabilityAuthSigs: [capacityDelegationAuthSig],
        expiration: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 10 minutes
        resourceAbilityRequests,
        authNeededCallback: async ({ uri, expiration, resourceAbilityRequests, }) => {
            const toSign = await (0, auth_helpers_1.createSiweMessage)({
                uri,
                expiration,
                resources: resourceAbilityRequests,
                walletAddress: await signer.getAddress(),
                nonce: await client.getLatestBlockhash(),
                litNodeClient: client,
            });
            return await (0, auth_helpers_1.generateAuthSig)({
                signer: signer,
                toSign,
            });
        },
    });
    return sigs;
};
exports._createSessionSignatures = _createSessionSignatures;
