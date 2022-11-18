import logo from '../../../assets/bet-app-icon.png'
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../services/user-context';

export const Home = () => {
    const user = useUserContext();

    return <div className="mt-5 d-flex flex-column align-items-center">
        <h3 className='text-center'>Witaj {user && user.nick} w <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            /> Bet App!</h3>

        <h5 className='text-center my-3'><Link to="/ranking">Sprawdź</Link> kto aktualnie wygrywa!</h5>
        {
            user
                ? <h5 className='text-center'>Przejdź do <Link to="/bets">"moje zakłady"</Link> <br /> by obstawić mecze i zwycięzców!</h5>
                : <h5 className='text-center'>Jeżeli też chcesz zagrać to <Link to="/sign-up">zarejestruj się</Link>!</h5>
        }
    </div>
}