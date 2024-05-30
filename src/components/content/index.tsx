import { Routes, Route } from 'react-router-dom';
import { Bets } from './bets';
import { Home } from './home';
import { Ranking } from './ranking';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';
import { HallOfFame } from './hall-of-fame';

export const Content = () => {
  return (
    <div className='p-3'>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/bets' element={<Bets />} />
            <Route path='/halloffame' element={<HallOfFame />} />
            <Route path='/ranking' element={<Ranking />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
        </Routes>
    </div>
  );
}

export default Content;
