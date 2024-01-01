export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: "Yarc (yet another counter reducer)",
}

export default function counterReducer (state = initialState, action: any) {
    return state;
}