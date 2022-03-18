export interface ISwitchState {
    element: React.ComponentType<any>;
    redirect?: string;
    params: Record<string, unknown>;
    loading: boolean;
    key: string;
}

export default ISwitchState;
