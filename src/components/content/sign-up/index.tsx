import {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { DATABASE_URL } from '../../../constants';

export const SignUp = () => {
    const navigate = useNavigate();
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
    const handleNickChange = (e: ChangeEvent<HTMLInputElement>) => setNick(e.target.value)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((data) => {
                fetch(`${DATABASE_URL}/users/${data.user.uid}.json`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        nick
                    })
                })
            })
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                alert(err);
            })
    }
  return (
    <div className="d-flex flex-column align-items-center">
        <Form className='d-flex flex-column' onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Nick</Form.Label>
            <Form.Control type="text" placeholder="Podaj nick" value={nick} onChange={handleNickChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Podaj email" value={email} onChange={handleEmailChange} />
            <Form.Text className="text-muted">
            Wstaw jakikolwiek, np. ciacho@ciacho.pl, <br /> ale zapamiętaj go, bo będzie potrzebny do logowania
            </Form.Text>
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
                Masz ju konto? <Link to="/bet-app/sign-in">Zaloguj się</Link>!
            </Form.Text>
        </Form.Group>
        </Form>
    </div>
  );
}
