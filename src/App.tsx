import {useEffect} from 'react';
import {useStore} from './store';

function App() {
    const { test, updateState, testObs} = useStore();

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
            {test}{testObs}
        </div>
    );
}

function Comp1() {

}

function Comp2() {

}

export default App;
