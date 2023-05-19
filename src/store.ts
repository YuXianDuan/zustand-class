import {create, StoreApi, UseBoundStore} from 'zustand';
import 'reflect-metadata';

function action() {
    return Reflect.metadata('action', 'true');
}

function makeObservable(target: any) {
    const fields = Object.getOwnPropertyNames(target.__proto__);
    for (let field of fields) {
        const metadataValue = Reflect.getMetadata('action', target, field);
        if (!metadataValue)
            continue;

        target[field] = target.__proto__[field].bind(target);
    }
}

function makeAutoObservable(target: any) {
    const fields = Object.getOwnPropertyNames(target.__proto__);
    for (let field of fields) {
        target[field] = target.__proto__[field].bind(target);
    }
}

type Set<T> = (partial: Partial<T> | ((state: T) => (Partial<T>)), replace?: boolean) => void;
type Get<T> = () => T;

class StateV1 {
    test = 8;

    constructor(private readonly set: Set<StateV1>, private readonly get: Get<StateV1>) {
        makeObservable(this);
    }

    @action()
    public updateState() {
        this.set({test: 1});
    }

    @action()
    public updateState2() {
        this.set((state) => ({...state, test: 2}));
    };
}

const useStoreV1 = create<StateV1>((set, get) => new StateV1(set, get));


class StateV2 {
    protected set: Set<this> = null!;
    protected get: Get<this> = null!;
    useState: UseBoundStore<StoreApi<this>> = null!;

    test = 2;

    protected init() {
        this.useState = create<this>((set, get) => {
            this.set = set;
            this.get = get;

            makeObservable(this);
            return this;
        });
    }
}

class Test extends StateV2 {
    test = 1;

    constructor() {
        super();
        this.init();
    }

    @action()
    public updateState() {
        this.set((state) => ({...state, test: 2}));
    };
}

const useStoreV2 = new Test().useState;

export const useStore = useStoreV1;
