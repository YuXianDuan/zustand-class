// 与 react context 用法基本类似
import React, { useEffect } from "react";
import { create } from "zustand";

type Dog = {
    name: string
    age: string
    color: string
}
type Cat = Dog;
type Store = {
    dog: Dog,
    cat: Cat,
    setDog: (dog: Dog) => void,
    setDogName: (color: string) => void,
    setCat: () => void
}

const useStore = create<Store>((set) => ({
    dog: {
        name: 'ddd',
        age: '2',
        color: 'red',
    },
    cat: {
        name: 'ccc',
        age: '1',
        color: 'yellow',
    },
    // setDog: () => set((state) => ({ ...state, dog: state.dog })),
    setDog: (dog: Dog) => set((state) => {
        console.log(state, '--state--');
        
        return { ...state, dog: dog }
    }),

    setDogName: (name: string) => set((state) => ({ ...state, dog: {...state.dog, name} })),

    setCat: () => set((state) => ({ ...state, cat: state.cat })),
}));

export const AppIni = () => {

    const Dog = () => {
        // const dog = useStore(store => store.dog);
        const name = useStore(store => store.dog.name);

        const setDog = useStore(store => store.setDog);

        const setDogColor = useStore(store => store.setDogName);

        console.log(name, 'is been created');
        
        useEffect(
            () => {
                const timer = setTimeout(
                    () => {
                        setDog({
                            name: 'ddd-x',
                            age: '2-x',
                            color: 'red-x',
                        });

                        // setDogColor('ddd-x');
                    },
                    3650
                )
                return () => {
                    clearTimeout(timer);
                }
            },
            []
        );
        return <div>{name}</div>
    }
    const DogColor = () => {
        const color = useStore(store => store.dog.color);
        console.log(color,'is been created');
        return  <div>{color}</div>
    }

    const Cat = () => {
        const cat = useStore(store => store.cat);
        console.log(cat.name,'is been created');
        return <div>{cat.name}</div>
    }

    console.log("AppIni");
    return <div>
        <Dog />
        <DogColor />
        {/* <Cat /> */}
    </div>;
};
