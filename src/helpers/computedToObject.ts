export function computedToObject<T>(target: T, computed: (keyof T)[]) {
    return computed.reduce((acc, key) => {
        acc[key] = target[key];
        return acc;
    }, {} as Partial<T>);
}
