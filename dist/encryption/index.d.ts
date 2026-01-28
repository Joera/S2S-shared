export declare const encryptContent: (oxoCtrlr: any, streamId: string, dealsModule: string, toEncrypt: any) => Promise<string>;
export declare const canRead: (stream_id: string, safeAddress: string, dealsModule: string) => ({
    conditionType: "evmContract";
    contractAddress: string;
    functionName: string;
    functionParams: string[];
    functionAbi: {
        name: string;
        inputs: {
            name: string;
            type: string;
        }[];
        outputs: {
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    };
    chain: "base";
    returnValueTest: {
        key: string;
        comparator: "=";
        value: string;
    };
    operator?: undefined;
} | {
    operator: string;
    conditionType?: undefined;
    contractAddress?: undefined;
    functionName?: undefined;
    functionParams?: undefined;
    functionAbi?: undefined;
    chain?: undefined;
    returnValueTest?: undefined;
})[];
//# sourceMappingURL=index.d.ts.map