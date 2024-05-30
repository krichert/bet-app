import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { getAuth, signOut} from 'firebase/auth';

import logo from '../../assets/bet-app-icon.png'
import { useUserContext  } from '../../services/user-context';

export const Navigation = () => {
  const user = useUserContext();
  
  const handleSignOutClick = () => {
    const auth = getAuth();
    signOut(auth);
  }


  return (
    <Navbar collapseOnSelect expand="sm" bg="primary" variant="dark" className='px-3'>
        <Navbar.Brand href="/bet-app">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
            {user && <span className="mx-2">Bet App</span>}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="ranking">Ranking</Nav.Link>
            <Nav.Link as={Link} to="halloffame">Hala sław</Nav.Link>
            {user && <Nav.Link as={Link} to="/bets">Moje zakłady</Nav.Link>}
          </Nav>
          <Nav>
            {
                user 
                    ? <>
                        <Navbar.Text>Echo {user.nick}!</Navbar.Text>
                        <Nav.Link onClick={handleSignOutClick}>Wyloguj</Nav.Link>
                    </>
                    : <Nav.Link as={Link} to="/sign-in">Logowanie</Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
