import React, { useState } from 'react'
import { question } from '../../interfaces/question.interface'
import './questionDetail.scss'
import { useSelector } from 'react-redux'
import { Store } from '../../store'

export default function QuestionDetail() {
  const questionStore = useSelector((store: Store) => store.questionStore)
  let question: question[];
  if (questionStore.data) { question = questionStore.data }

  const [questionId, setQuestionId] = useState<number | null>(question[0]?.id)
  const [position, setPosition] = useState(1)
  const [sumOfCorrectAnswer, setSumOfCorrectAnswer] = useState(0)
  const [display, setDisplay] = useState(false)
  const handleAnswer = (is_answer: boolean) => {
    if (is_answer) {
      setSumOfCorrectAnswer(sumOfCorrectAnswer + 1)
    }

    setPosition(position + 1)

    if (position <= question?.length - 1) {
      setQuestionId(question[position]?.id)

    } else {
      setQuestionId(null)
    }
    if (position == question?.length) {
      setDisplay(true)
    }
  }
  return (
    <>
      <div className='question_container'>
        {
          question?.map((item) => (<div className='box' key={Date.now() * Math.random()}>
            {questionId == item?.id && <>
              <span>{`Correct Answer:${sumOfCorrectAnswer}/${question?.length}`}</span>
              <p>{item?.content}</p>
              {item?.answers?.map(answer => {
                return (
                  <div className='answer' key={Date.now() * Math.random()}>
                    <button onClick={() => {
                      handleAnswer(answer?.is_answer)
                    }}>{answer?.content}</button>
                  </div>
                )
              })}
              <button className='next' onClick={() => {
                handleAnswer(false)
              }}>Next question</button>
            </>}


          </div>))
        }
        {display && <>

          <div className='end_box'>
            <div className='end_content'>
              <h1>Congrats</h1>
              <p>{`You answered: ${(sumOfCorrectAnswer * 100 / question?.length)}%`} </p>
              <button
                onClick={() => {
                  window.location.href = '/'
                }}
              >Play Again</button>
            </div>
          </div>
        </>}
      </div>

    </>
  )
}
