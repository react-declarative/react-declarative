export interface ISwitchState {
    element: React.ComponentType<any>;
    redirect?: string;
    params: Record<string, unknown>;
    key: string;
}

export default ISwitchState;
