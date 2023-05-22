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
        </div>
    );
}

function Comp1() {
    const test = useStore((st) => st.test1);
    console.log(counter++);

    return <div>{test}</div>
}

function Comp2() {
    const test = useStore((st) => st.test2);
    console.log(counter++);

    return <div>{test}</div>
}

function Comp3() {
    const test = useStore((st) => st.testObs);
    console.log(counter++);

    return <div>{test}</div>
}

export default App;
