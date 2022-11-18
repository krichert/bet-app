import { Routes, Route } from 'react-router-dom';
import { Bets } from './bets';
import { Home } from './home';
import { Ranking } from './ranking';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';

export const Content = () => {
  return (
    <div className='p-3'>
        <Routes>
            <Route path='/bet-app/' element={<Home />} />
            <Route path='/bet-app/bets' element={<Bets />} />
            <Route path='/bet-app/ranking' element={<Ranking />} />
            <Route path='/bet-app/sign-in' element={<SignIn />} />
            <Route path='/bet-app/sign-up' element={<SignUp />} />
        </Routes>
    </div>
  );
}

export default Content;
