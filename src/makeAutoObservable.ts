import {create} from 'zustand';
import {computedToObject} from './helpers/computedToObject';

// 这便利了一层，需要深层遍历
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
            if(Object.prototype.toString.call(field) === '[Object object]') {
                // 1. 设置该属性的 get set 行为
                // 2. 对该属性的属性深度递归设置 get set 行为
            }
            let fieldValue = target[field];
            // 可以换成使用 proxy 代理
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
