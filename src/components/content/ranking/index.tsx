import {useState, useEffect} from 'react';
import moment, { Moment } from 'moment-timezone';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import { DATABASE_URL } from '../../../constants';
import { calculateAllPoints, calculateAllWinnerPoints, calculatePoints } from '../../../utils';
import { BadgePoint } from '../bets/badge-point';
import { Match } from '../bets';


export const Ranking = () => {
    const [today, setToday] = useState<Moment | null>(null);
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

    useEffect(() => {
        const now = moment();
        setToday(now);

        const interval = setInterval(() => {
            const now = moment();
            setToday(now);
        }, 60000);

        return () => {
            clearInterval(interval);
        }
    }, [])


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

    // @ts-expect-error
    const firstMatchDate: string = data ? data.matches.reduce((acc, curr) => {
        return moment(curr.date).diff(acc) > 0 ? acc : curr.date;
    }, data.matches[0] ? data.matches[0].date : ''): '';

    // @ts-expect-error
    const avaiableMatches = data && data.matches && data.matches.filter(match => {
        const dateUtc = moment.utc(match.date);

        return today ? moment(today).isAfter(dateUtc) : true;
    }).reverse();

    const getPoints = (match: Match, user:any) => {
        const betA = user.matches && user.matches[match.id] && user.matches[match.id].betA;
        const betB = user.matches && user.matches[match.id] && user.matches[match.id].betB;
    
        return calculatePoints({ scoreA: match.scoreA, scoreB: match.scoreB, betA, betB });
    }


    return (
        <>
            {
                !data
                    ? (
                        <div className="m-5 d-flex justify-content-center align-items-center"><Spinner /></div>
                    )
                    : (
                        <Accordion alwaysOpen>
                            {
                                // @ts-expect-error
                                userWithPoints.map((user, index) => (
                                    <Accordion.Item
                                        eventKey={user.nick}
                                        key={user.nick}
                                    >
                                        <Accordion.Header>
                                            <Badge bg={`${index === 0 ? "warning" : "primary"}`} pill>
                                                {user.points}
                                            </Badge>
                                            <div className="mx-2">
                                                {index === 0 ? <span>👑</span> : null}
                                            </div>
                                            <div className="fw-bold">{user.nick}</div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <h6 className='font-weight-bold'>Mecze <Badge pill bg="dark">{calculateAllPoints(data.matches, user.matches)}</Badge></h6>
                                            {
                                                // @ts-expect-error
                                                avaiableMatches && avaiableMatches.map((match) => (
                                                    <div className="row d-flex align-items-center my-1" key={match.id}>
                                                        <div className="col-6 text-truncate">{match.teamA} : {match.teamB}</div>
                                                        <div className="col-2 d-flex justify-content-center">
                                                            <Badge bg="secondary">{match.scoreA}:{match.scoreB}</Badge>
                                                        </div>
                                                        <div className="col-2 d-flex justify-content-center">
                                                            <Badge bg="info">
                                                                {user.matches && user.matches[match.id] && user.matches[match.id].betA || 'X'}
                                                                    : 
                                                                {user.matches && user.matches[match.id] && user.matches[match.id].betB || 'X'}
                                                             </Badge>
                                                        </div>
                                                        <div className="col-2">
                                                            {match.scoreA != null && match.scoreB != null
                                                                ? <BadgePoint points={getPoints(match, user)} />
                                                                : <Badge pill bg="dark">?</Badge>
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <h6 className='font-weight-bold mt-3'>Zwycięzcy <Badge pill bg="dark">{calculateAllWinnerPoints(data.winners, user.winners)}</Badge></h6>
                                            {
                                                today 
                                                    ? moment(today).isAfter(firstMatchDate)
                                                        ? (
                                                            <div className="row">
                                                                {
                                                                    user.winners && <div className="col-12">
                                                                        Zwycięzca: <b>{user.winners.winner}</b>                                     
                                                                        {data.winners && (data.winners.winner != null ? (data.winners.winner === user.winners.winner ? ' ✅' : ' ❌') : null)}
                                                                        </div>
                                                                }
                                                                {
                                                                    user.winners && Object.keys(user.winners).filter(key => key !== 'winner').map(key => (
                                                                        <div className="col-6 text-truncate">
                                                                            {key}: <b>{user.winners[key]}</b>
                                                                            {data.winners && (data.winners[key] != null ? (data.winners[key] === user.winners[key] ? ' ✅' : ' ❌') : null)}
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        )
                                                        : null
                                                    : null
                                            }
                                        </Accordion.Body> 
                                    </Accordion.Item>
                                ))
                            }
                        </Accordion>
                    )
            }
        </>
    );
}