

function StartScreen({numQuestions}) {
    return (
        <div className="start">
            <h2>Welcome to the React Quiz</h2>
            {console.log(numQuestions)}
            <h3>{numQuestions} Question to the test Your React Mastery</h3>
            <button className="btn btn-ui">Let's Start</button>
        </div>
    )
}

export default StartScreen
