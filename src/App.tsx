import {useEffect} from 'react';
import {useStore} from './store';

let counter = 0;

function App() {
    const updateState = useStore((st) => st.updateState);

    console.log(counter++);
    useEffect(() => {
        const subs = [
            setTimeout(() => updateState(), 2000),
            // setTimeout(() => updateState2(), 3000),
        ]

        return () => {
            subs.forEach(clearTimeout)
        }
    }, [])

    return (
        <div className="App">
            <Comp1/>
            <Comp2/>
            <Comp3/>
            <Comp4/>
            <Comp5/>
        </div>
    );
}

function Comp1() {
    const test = useStore((st) => st.test1);
    console.log('Comp1-',counter++);

    return <div>Comp1-{test}</div>
}

function Comp2() {
    const test = useStore((st) => st.test2);
    console.log('Comp2-', counter++);

    return <div>Comp2-{test}</div>
}

function Comp3() {
    const test = useStore((st) => st.testObs);
    console.log('Comp3-', counter++);
    
    return <div>Comp3-{test}</div>
}

function Comp4() {
    const test4 = useStore(st => st.test4)(store => store)
    useEffect(() => {
        const timer = setTimeout(() => {
            test4.age = '40';
        }, 3650);
        return () => {
            clearTimeout(timer);
        }
    })
    console.log('Comp4-', counter++);
    return <div>Comp4-{test4.name}{test4.age}</div>
}

function Comp5() {
    const test4 = useStore(st => st.test4)(store => store)
    console.log('Comp5-', counter++);
    return <div>Comp5-{test4.name}</div>
}

export default App;
