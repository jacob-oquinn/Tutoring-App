import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";



export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const tutorTopicRef = useRef()
    const studentTopicRef = useRef()
    const { signUp, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [tutoringSubjects, setTutoringSubjects] = useState([])
    const [studentSubjects, setStudentSubjects] = useState([])

    const navigate = useNavigate()
    
    // TODO remove hard coded subjects
    const subjects = ['Calc III', 'Comp. Sci. I', 'Spanish', 'Discrete']
    

    async function handleSubmit(e) {
        e.preventDefault() // prevent refreshing

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        // check if at least 2 subjects are selected from each
        if(tutoringSubjects.length < 2 || studentSubjects < 2) {
            return setError('Please select two subjects from both fields')
        }

        try {
            setError('') // reset error
            setLoading(true) // disable button to prevent multiple submission
            await signUp(emailRef.current.value, passwordRef.current.value, tutoringSubjects, studentSubjects)
            navigate('/')
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
    }

    // This could cause errors where the screen displays checked but the subj hasn't been added to the appropriate array
    function handleChangeTutor(e) {
        setTutoringSubjects(e)
    }
    function handleChangeStudent(e) {
        setStudentSubjects(e)
    }
    return (
        <>
            <Card>
                <Card.Body >
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {currentUser && currentUser.email}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>

                        <Form.Group className="mb-2" id="tutor">
                            <Form.Label>Topics You Can Teach</Form.Label>
                            <DropdownMultiselect
                                options={subjects}
                                handleOnChange={(e) => {handleChangeTutor(e)}}
                                name="Subjects"
                            />
                        </Form.Group>
                        <Form.Group className="mb-1" id="student">
                            <Form.Label>Topics You Need Help</Form.Label>
                            <DropdownMultiselect
                                options={subjects}
                                handleOnChange={(e) => {handleChangeStudent(e)}}
                                name="Subjects"
                                />
                        </Form.Group>
                        <Button disabled={loading} className="mt-4 w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to='/login'>Already have an account?</Link>
            </div>
        </>
    )
}



