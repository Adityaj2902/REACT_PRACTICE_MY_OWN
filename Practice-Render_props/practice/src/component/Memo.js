import React, { useState, useMemo } from "react";

const UseMemoOperation = () => {
    const [counter, setCounter] = useState(0);
    const [input, setInput] = useState(0);

    function expensiveTask(num) {
        console.log("Inside expensive task");
        for (let i = 0; i < 100000; i++) {} // Simulating expensive task
        return num * 2;
    }

    const doubleValue = useMemo(() => expensiveTask(input), [input]);

    return (
        <div>
            <button onClick={() => setCounter(counter + 1)}>Counter</button>
            <div>{counter}</div>

            <input
                type="number"
                value={input}
                onChange={(e) => setInput(Number(e.target.value))}
            />

            <div>Double: {doubleValue}</div>
        </div>
    );
};

export default UseMemoOperation;
