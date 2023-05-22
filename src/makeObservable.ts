import {create} from 'zustand';
import {computedToObject} from './helpers/computedToObject';
import 'reflect-metadata';

export function makeObservable<T extends Object>(target: T) {
    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype) as (keyof T & string)[];
    const fields = Object.getOwnPropertyNames(target) as (keyof T & string)[];
    const computed: (keyof T)[] = [];

    return create<T>((set) => {
        for (const methodName of methods) {
            const isAction = Reflect.getMetadata('action', target, methodName);
            if ((isAction) && prototype[methodName].bind)
                target[methodName] = prototype[methodName].bind(target);

            const isComputed = Reflect.getMetadata('computed', target, methodName);
            if (isComputed)
                computed.push(methodName);
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
                        set(() => {
                            fieldValue = newValue;
                            return ({[field]: newValue, ...computedToObject(target, computed)});
                        });
                    },
                });
            }
        }


        return target;
    });
}


