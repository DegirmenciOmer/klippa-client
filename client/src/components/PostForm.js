import { React, useState, useEffect } from 'react'
import axios from 'axios'

import { Grid, Form, Button } from 'semantic-ui-react'
import Loading from '../components/Loading'
import FeedbackModal from './FeedbackModal'

const PostForm = () => {
  const [questions, setQuestions] = useState([])
  const [replyId, setReplyId] = useState('')
  const [feedbackState, setFeedbackState] = useState('')
  const [feedbacksArray, setFeedbacksArray] = useState([])

  const fetchQuestions = async () => {
    try {
      setQuestions([])
      const { data } = await axios.get(
        'https://klippa--tech-calculation-game.herokuapp.com/'
      )

      setQuestions(
        data.questions.map((q) => {
          return {
            question: q.question,
            answer: '',
            id: q.id,
          }
        })
      )
      setReplyId(data._id)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {
        data: { message, feedbacks },
      } = await axios.post(
        'https://klippa--tech-calculation-game.herokuapp.com/quest/session',
        {
          questions,
          replyId,
        }
      )
      setFeedbacksArray(feedbacks)
      setFeedbackState(message)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Form onSubmit={handleSubmit} className='ui centered' size='large'>
        {questions.length === 0 ? (
          <Loading />
        ) : (
          questions.map((q) => (
            <Form.Group width='large' key={q.id}>
              <Grid.Column verticalAlign='middle' floated='left'>
                <label>{q.question}</label>
              </Grid.Column>

              <Grid.Column>
                <Form.Input
                  type='number'
                  required
                  value={q.answer}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)

                    const newQuestions = questions.map((question) => {
                      if (question.id === q.id) {
                        return {
                          ...question,
                          answer: val,
                        }
                      } else {
                        return question
                      }
                    })
                    setQuestions(newQuestions)
                  }}
                  placeholder='Your Answer'
                />
              </Grid.Column>
            </Form.Group>
          ))
        )}
        <Button fluid floated='right'>
          Submit Answers
        </Button>
      </Form>
      {feedbackState && (
        <FeedbackModal
          feedbackState={feedbackState}
          feedbacksArray={feedbacksArray}
          setFeedbackState={setFeedbackState}
          fetchQuestions={fetchQuestions}
        />
      )}
    </>
  )
}

export default PostForm
