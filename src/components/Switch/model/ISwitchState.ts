export interface ISwitchState {
    component: React.ComponentType<any>;
    redirect?: string;
    params: Record<string, unknown>;
}

export default ISwitchState;
