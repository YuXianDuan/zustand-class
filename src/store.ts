import {makeAutoObservable} from './makeAutoObservable';
import React from 'react';

class subState {
    name = 'luo'
    age = '39'
}

class State {
    test1 = 1;
    test2 = 2;

    get testObs() {
        return this.test1 * 2;
    }

    // hooks 调用规则导致不能这样使用
    test4 = makeAutoObservable(new subState());

    public async updateState() {
        await new Promise((r) => setTimeout(r, 10))
        // this.test1 = 2;
        // await new Promise((r) => setTimeout(r, 10))
        // this.test1 = 4;

        // 更新了
        // this.test4 = {
        //     ...this.test4,
        //     age: '40',
        // }

        // 不更新
        // this.test4.age = '40';
    };
}

export const useStore = makeAutoObservable(new State());
