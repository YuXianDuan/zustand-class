import {create, StoreApi, UseBoundStore} from 'zustand';
import 'reflect-metadata';

function action() {
    return Reflect.metadata('action', 'true');
}

function observable() {
    return Reflect.metadata('observable', 'true');
}

function computed() {
    return Reflect.metadata('computed', 'true');
}

// function makeObservable(target: any) {
//     const fields = Object.getOwnPropertyNames(target.__proto__);
//     for (let field of fields) {
//         const metadataValue = Reflect.getMetadata('action', target, field);
//         if (!metadataValue)
//             continue;
//
//         target[field] = target.__proto__[field].bind(target);
//     }
// }

function makeAutoObservable(target: any) {
    const fields = Object.getOwnPropertyNames(target.__proto__);
    for (let field of fields) {
        if (typeof target[field] == 'function')
            target[field] = target.__proto__[field].bind(target);
    }
}

type Set<T> = (partial: Partial<T> | ((state: T) => (Partial<T>)), replace?: boolean) => void;
type Get<T> = () => T;

function computedToObject<T>(target: T, computed: (keyof T)[]) {
    return computed.reduce((acc, key) => {
        acc[key] = target[key];
        return acc
    }, {} as Partial<T>)
}

function makeObservable<T extends Object>(target: T) {
    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype) as (keyof T)[] & string;
    const fields = Object.getOwnPropertyNames(target) as (keyof T)[] & string;
    const computed: string[] = [];

    return create<T>((set,get) => {
        for (const methodName of methods) {
            const isAction = Reflect.getMetadata('action', target, methodName);
            if (isAction)
                target[methodName] = prototype[methodName].bind(target);

            const isComputed = Reflect.getMetadata('computed', target, methodName);
            if (isComputed)
                computed.push(methodName)
        }

        for (const field of fields) {
            const isObservable = Reflect.getMetadata('observable', prototype, field);
            if (isObservable) {
                let fieldValue = target[field];
                Object.defineProperty(target, field, {
                    get() {
                        return fieldValue;
                    },
                    set(newValue) {
                        set((prev) => {
                            fieldValue = newValue;
                            return ({...prev, [field]: newValue, ...computedToObject(target, computed)});
                        })
                    }
                })
            }
        }


        return target;
    })
}

// class StateV1 {
//     @observable()
//     test = 8;
//
//     constructor() {
//         makeObservable(this);
//     }
//
//     @action()
//     public updateState() {
//         this.set({test: 1});
//     }
//
//     @action()
//     public updateState2() {
//         this.set((state) => ({...state, test: 2}));
//     };
// }
//
// const useStoreV1 = create<StateV1>((set, get) => new StateV1(set, get));
//
//
// class StateV2 {
//     protected set: Set<this> = null!;
//     protected get: Get<this> = null!;
//     useState: UseBoundStore<StoreApi<this>> = null!;
//
//     test = 2;
//
//     protected init() {
//         this.useState = create<this>((set, get) => {
//             this.set = set;
//             this.get = get;
//
//             makeObservable(this);
//             return this;
//         });
//     }
// }
//
// class Test extends StateV2 {
//     test = 1;
//
//     constructor() {
//         super();
//         this.init();
//     }
//
//     @action()
//     public updateState() {
//         this.set((state) => ({...state, test: 2}));
//     };
// }

// const useStoreV2 = new Test().useState;

// export const useStore = useStoreV1;

// class StateV3 {
//     @computed()
//     get testObs() {
//         return this.test * 2;
//     }
//
//     @observable()
//     test = 1;
//
//     useStore = makeObservable(this);
//
//     @action()
//     public async updateState() {
//         await new Promise((r) => setTimeout(r, 10))
//         this.test = 2;
//     };
// }
//
// const useStoreV3 = new StateV3().useStore;

class StateV3Alt {
    @computed()
    get testObs() {
        return this.test * 2;
    }

    @observable()
    test = 1;

    @action()
    public async updateState() {
        await new Promise((r) => setTimeout(r, 10))
        this.test = 2;
    };
}

const useStoreV3Alt = makeObservable(new StateV3Alt());

export const useStore = useStoreV3Alt
