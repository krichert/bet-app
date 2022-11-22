import {ChangeEvent, useState} from 'react';
import moment, { Moment } from 'moment-timezone';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { useUserContext } from '../../../../services/user-context';
import { DATABASE_URL } from '../../../../constants';
import { Match } from '..';
import { BadgePoint } from '../badge-point';
import { calculatePoints, calculateAllPoints } from '../../../../utils';


export const MatchesAcordion = ({ matches, today, day }: { matches: Match[], today: Moment | null, day: string }) => {
    const user = useUserContext();

    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>((user && user.matches) ? user.matches : {});

    const handleChange = (e: ChangeEvent<any>, matchId: string) => {
        setFormData({
            ...formData,
            [matchId]: {
                ...formData[matchId],
                [e.target.name]: e.target.value
            }
        })
    }

    const formatDate = (inputDate: string) => {
        return moment.utc(inputDate).tz('Europe/Warsaw').format("DD/MM/YYYY HH:mm"); 
    } 

    const isInputDisabled = (inputDate: string) => {
        const inputDateUtc = moment.utc(inputDate);
        return today ? moment(today).isAfter(inputDateUtc) : true;
    } 

    if (!user) {
        return null;
    }

    const handleSaveClick = () => {
        fetch(`${DATABASE_URL}/users/${user.uid}/matches.json`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        }).then(() => {
            user.refresh();
            setEditMode(false);
        })
    }

    const { matches: userMatches } = user;

    const getPoints = (match: Match) => {
        const betA = user.matches && user.matches[match.id] && user.matches[match.id].betA;
        const betB = user.matches && user.matches[match.id] && user.matches[match.id].betB;
    
        return calculatePoints({ scoreA: match.scoreA, scoreB: match.scoreB, betA, betB });
    }

    return (
        <Accordion.Item eventKey={day}>
            <Accordion.Header>
                <Badge className="mx-3" bg="secondary">{calculateAllPoints(matches, user.matches)}</Badge> Mecze {day} 
            </Accordion.Header>
            <Accordion.Body>
                {
                    matches.map((match) => (
                        <div key={match.id} className="row mb-3">
                            <div className="row mb-2">
                                <div className="col d-flex justify-content-center">
                                    <b>{formatDate(match.date)}</b>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col d-flex justify-content-center">
                                    <BadgePoint points={getPoints(match)} />
                                </div>
                            </div>
                            <div className="row d-flex align-items-center">
                                <div className="col-3 d-flex justify-content-end px-3">{match.teamA}</div>
                                <div className="col-6 p-0">
                                    <div className="row d-flex align-items-center">
                                        <div className="col-5 d-flex justify-content-center p-0">
                                            {isEditMode 
                                                ? <Form.Control disabled={isInputDisabled(match.date)} name="betA" value={formData && formData[match.id] && formData[match.id].betA} onChange={(e) => handleChange(e, match.id)} type="number" />
                                                : <p className="m-0">{(userMatches && userMatches[match.id] && userMatches[match.id].betA) || 'X'}</p>
                                            }
                                        </div>
                                        <div className="col-2 d-flex justify-content-center">:</div>
                                        <div className="col-5 d-flex justify-content-center p-0">
                                            {isEditMode 
                                                ? <Form.Control disabled={isInputDisabled(match.date)} name="betB" value={formData && formData[match.id] && formData[match.id].betB} onChange={(e) => handleChange(e, match.id)} type="number" />
                                                : <p className="m-0">{(userMatches && userMatches[match.id] && userMatches[match.id].betB) || 'X'}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 px-3">{match.teamB}</div>
                            </div>
                            {(match.scoreA != null && match.scoreB != null) ? (
                                <div className="row mt-2">
                                    <div className="col d-flex justify-content-center">
                                        <Badge bg="secondary">{match.scoreA} : {match.scoreB}</Badge>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                    ))
                }
                <div className="row mb-3">
                    <div className='col d-flex justify-content-end'>
                        {isEditMode 
                            ? <>
                                <Button variant='secondary' onClick={() => setEditMode(false)}>Wyjdź</Button>
                                <Button variant='success' onClick={handleSaveClick}>Zapisz</Button>
                            </>
                            : <Button onClick={() => setEditMode(true)}>Edytuj</Button>
                        }   
                    </div>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}