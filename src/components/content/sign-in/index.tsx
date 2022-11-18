import {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/');
            })
    }
  return (
    <div className="d-flex flex-column align-items-center">
        <Form className='d-flex flex-column' onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Podaj email" value={email} onChange={handleEmailChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Hasło</Form.Label>
            <Form.Control type="password" placeholder="Podaj hasło" value={password} onChange={handlePasswordChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
            Wyślij
        </Button>

        <Form.Group className="mt-3">
            <Form.Text className="text-muted">
                Nie posiadasz konta? <Link to="/sign-up">Zarejestruj się</Link>!
            </Form.Text>
        </Form.Group>
        </Form>
    </div>
  );
}
