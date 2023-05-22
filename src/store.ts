import {makeAutoObservable} from './makeAutoObservable';

class State {
    test1 = 1;
    test2 = 2;

    get testObs() {
        return this.test1 * 2;
    }

    public async updateState() {
        await new Promise((r) => setTimeout(r, 10))
        this.test1 = 2;
        await new Promise((r) => setTimeout(r, 10))
        this.test1 = 4;
    };
}

export const useStore = makeAutoObservable(new State());
