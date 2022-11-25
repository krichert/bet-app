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
                                        key={user.uid}
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
                                            {
                                                // @ts-expect-error
                                                avaiableMatches && avaiableMatches.map((match) => (
                                                    <div className="row d-flex align-items-center my-1">
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
                                                                : <Badge bg="dark">?</Badge>
                                                            }
                                                        </div>
                                                    </div>
                                                ))
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