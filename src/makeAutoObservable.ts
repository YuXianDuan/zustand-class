import {create} from 'zustand';
import {computedToObject} from './helpers/computedToObject';


export function makeAutoObservable<T extends Object>(target: T) {
    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype) as (keyof T & string)[];
    const fields = Object.getOwnPropertyNames(target) as (keyof T & string)[];
    const computed: (keyof T)[] = [];

    return create<T>((set) => {
        for (const methodName of methods) {
            if (typeof target[methodName] !== 'function')
                computed.push(methodName);
            else
                target[methodName] = prototype[methodName].bind(target);
        }

        for (const field of fields) {
            let fieldValue = target[field];
            Object.defineProperty(target, field, {
                get() {
                    return fieldValue;
                },
                set(newValue) {
                    set(() => {
                        fieldValue = newValue;
                        return ({[field]: newValue, ...computedToObject(target, computed)});
                    });
                },
            });
        }

        return target;
    });
}
