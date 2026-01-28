import * as ethers from 'ethers'

export const encryptContent = async (
	oxoCtrlr: any,
	streamId: string,
	dealsModule: string,
	toEncrypt: any,
): Promise<string> => {

	const unifiedControlConditions = canRead(
		streamId,
		ethers.getAddress(oxoCtrlr.user.safe),
		ethers.getAddress(dealsModule),
	);

	// console.log(JSON.stringify(unifiedControlConditions));

	return JSON.stringify(
		await oxoCtrlr.lit.encryptWithUcc(
			JSON.stringify(toEncrypt),
			unifiedControlConditions,
		),
	);
};

export const canRead = (
	stream_id: string,
	safeAddress: string,
	dealsModule: string,
) => [
	{
        conditionType: "evmContract" as const,
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
        chain: "base" as const,
        returnValueTest: {
          key: "",
          comparator: "=" as const,  
          value: "true",
        }
    },
	{ operator: "and" },
	{
		conditionType: "evmContract" as const,
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
		chain: "base" as const,
		returnValueTest: {
			key: "",
			comparator: "=" as const,
			value: "true",
		},
	},
	{ operator: "and" },
	{
		conditionType: "evmContract" as const,
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
		chain: "base" as const,
		returnValueTest: {
			key: "",
			comparator: "=" as const,
			value: "true",
		},
	},
];
