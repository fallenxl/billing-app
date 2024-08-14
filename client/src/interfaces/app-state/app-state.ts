import { AssetState } from "../asset/asset.interface";
import { AuthState } from "../auth/auth";
import { BranchState } from "../branch/branch.interface";
import { CustomerState } from "../customer/customer.interface";

export interface AppState {
    auth: AuthState,
    asset: AssetState,
    customer: CustomerState,
    branch: BranchState,
    isLoading: {
        isLoading: boolean,
        message: string,
        progress: number,
    }
}