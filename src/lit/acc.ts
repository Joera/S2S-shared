export const canRead = (
	stream_id: string,
	safeAddress: string,
	publicationModule: string,
) => [
	{
        conditionType: "evmContract" as const,
        contractAddress: publicationModule, 
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
		contractAddress: publicationModule, 
		functionName: "isLicensed",
		functionParams: [stream_id],
		functionAbi: {
			name: "isLicensed",
			inputs: [{ name: "content_id", type: "string" }],
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

export const canPublish = (authorSafeAddress: string, publicationModule: string) => [
    {
        conditionType: "evmContract",
        contractAddress: publicationModule,
        functionName: "canPublish",
        functionParams: [authorSafeAddress],
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
    {operator: "and"},
    {
        conditionType: "evmContract",
        contractAddress: authorSafeAddress, 
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
        }
    }
];