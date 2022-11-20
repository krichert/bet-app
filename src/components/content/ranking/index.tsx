import {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import { DATABASE_URL } from '../../../constants';
import { calculateAllPoints, calculateAllWinnerPoints } from '../../../utils';


export const Ranking = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        Promise.all([
            fetch(`${DATABASE_URL}/users.json`).then(r => r.json()).then(obj => Object.keys(obj).map(key => ({ ...obj[key], id: key }))),
            fetch(`${DATABASE_URL}/matches.json`).then(r => r.json()).then(obj => Object.keys(obj).map(key => ({ ...obj[key], id: key }))),
            fetch(`${DATABASE_URL}/winners.json`).then(r => r.json())
        ]).then(([users, matches, winners]) => {
            setData({
                users,
                matches,
                winners
            })
        })
    }, []);


    const userWithPoints = data 
        ? data.users
            // @ts-expect-error
            .map(user => ({ ...user, points: calculateAllPoints(data.matches, user.matches) + calculateAllWinnerPoints(data.winners, user.winners) }))
            // @ts-expect-error
            .sort(function( a , b){
                if(a.points > b.points) return 1;
                if(a.points < b.points) return -1;
                return 0;
            })
            .reverse()
        : [];

        console.log(userWithPoints)

    return (
        <>
            {
                !data
                    ? (
                        <div className="m-5 d-flex justify-content-center align-items-center"><Spinner /></div>
                    )
                    : (
                        <ListGroup className="w-50 m-auto">
                            {
                                // @ts-expect-error
                                userWithPoints.map((user, index) => (
                                    <ListGroup.Item
                                        as="li"
                                        className={`d-flex justify-content-between align-items-center py-3 ${index === 0 ? 'bg-warning' : ''}`}
                                        key={user.uid}
                                    >
                                        <div className={`ms-2 me-auto`}>
                                            <div className="fw-bold">{user.nick}</div>
                                        </div>
                                        <div className="mx-2">
                                            {index === 0 ? <span>👑</span> : null}
                                        </div>
                                        <Badge bg="primary" pill>
                                            {user.points}
                                        </Badge>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    )
            }
        </>
    );
}