import {useEffect} from 'react';
import {useStore} from './store';

function App() {
    const { test, updateState,updateState2} = useStore();

    useEffect(() => {
        const subs = [
            setTimeout(() => updateState(), 2000),
            setTimeout(() => updateState2(), 3000),
        ]

        return () => {
            subs.forEach(clearTimeout)
        }
    }, [])

    return (
        <div className="App">
            {test}
        </div>
    );
}

export default App;
