export function action() {
    return Reflect.metadata('action', 'true');
}

export function observable() {
    return Reflect.metadata('observable', 'true');
}

export function computed() {
    return Reflect.metadata('computed', 'true');
}
