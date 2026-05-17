import { useState } from 'react'

const StatisticLine = (props) => {
  const {text, value} = props

  return (
    <tr>
      <td>{text} {value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad, all} = props

  const average = (good * 1 + neutral * 0 + bad * -1) / all
  const positive = (good * 100) / all

  if (good + neutral + bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    ) 
  }

  return (
    <div>
      <h1>statistics</h1>

      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={average}/>
          <StatisticLine text="positive" value={`${positive} %`} />
        </tbody>
      </table>
    </div>
  )
}

const Button = (props) => {
  const {onClick, text} = props

  return (
    <button onClick={onClick}>{text}</button>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={() => setGood(good + 1)} text="good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="bad"/>

      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} 
        all={all}
      />

    </div>
  )
}

export default App