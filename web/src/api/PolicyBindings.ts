import { DefaultClient, AKResponse, QueryArguments } from "./Client";
import { Policy } from "./Policies";

export class PolicyBinding {
    pk: string;
    policy: string;
    policy_obj: Policy;
    target: string;
    enabled: boolean;
    order: number;
    timeout: number;

    constructor() {
        throw Error();
    }

    static get(pk: string): Promise<PolicyBinding> {
        return DefaultClient.fetch<PolicyBinding>(["policies", "bindings", pk]);
    }

    static list(filter?: QueryArguments): Promise<AKResponse<PolicyBinding>> {
        return DefaultClient.fetch<AKResponse<PolicyBinding>>(["policies", "bindings"], filter);
    }

    static adminUrl(rest: string): string {
        return `/administration/policies/bindings/${rest}`;
    }
}
