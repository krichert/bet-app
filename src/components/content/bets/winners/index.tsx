import {ChangeEventHandler, useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { teams } from '../../../../data';
import { useUserContext } from '../../../../services/user-context';
import { DATABASE_URL } from '../../../../constants';
import { calculateAllWinnerPoints } from '../../../../utils';


export const WinnerAcordion = ({ isBlocked }: { isBlocked: boolean }) => {
    const user = useUserContext();

    const [winners, setWinners] = useState(null);
    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>(user ? user.winners : {});

    const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        fetch(`${DATABASE_URL}/winners.json`)
            .then(r => r.json())
            .then(data => {
                setWinners(data);
            })
    }, []);

    if (!user) {
        return null;
    }

    const handleSaveClick = () => {
        fetch(`${DATABASE_URL}/users/${user.uid}/winners.json`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        }).then(() => {
            user.refresh();
            setEditMode(false);
        })
    }

    const { winners: userWinners } = user;


    return (
        <Accordion.Item eventKey="winners">
            <Accordion.Header>
                <Badge className="mx-3" bg="secondary">{calculateAllWinnerPoints(winners, userWinners)}</Badge>
                Zwycięzcy
            </Accordion.Header>
            <Accordion.Body>
                <div className="row mb-3">
                    <Form.Group>
                        <Form.Label>Zwycięzca</Form.Label>
                            {isEditMode 
                                ? <Form.Select disabled={isBlocked} value={formData.winner} name="winner" onChange={handleChange}>
                                    <option hidden disabled selected value={undefined}> -- wybierz -- </option>
                                    {/* @ts-expect-error */}
                                    {Object.keys(teams).reduce<string[]>((acc, curr) => [...acc, ...teams[curr]], [])
                                        .map((team) => {
                                            return <option value={team}>{team}</option>
                                        })
                                    }
                                </Form.Select>
                                : <p className='text-muted'>{userWinners?.winner || 'nie obstawiono'}</p>
                            }
                    </Form.Group>
                </div>
                <div className="row mb-3">
                    {['A', 'B', 'C', 'D'].map((el) => (
                        <div className="col" key={el}>
                            <Form.Group>
                                <Form.Label>Grupa {el}</Form.Label>
                                {isEditMode 
                                    ? <Form.Select disabled={isBlocked} value={formData[el]} name={el} onChange={handleChange}>
                                        <option hidden disabled selected value={undefined}> -- wybierz -- </option>
                                        {/* @ts-expect-error */}
                                        {teams[el].map((team) => <option value={team}>{team}</option>)}
                                    </Form.Select>
                                    : <p className='text-muted'>{(userWinners && userWinners[el]) || 'nie obstawiono'}</p>
                                }

                            </Form.Group>
                        </div>
                    ))}
                </div>
                <div className="row mb-3">
                    {['E', 'F', 'G', 'H'].map((el) => (
                        <div className="col" key={el}>
                            <Form.Group>
                                <Form.Label>Grupa {el}</Form.Label>
                                {isEditMode 
                                    ? <Form.Select disabled={isBlocked} value={formData[el]} name={el} onChange={handleChange}>
                                        <option hidden disabled selected value={undefined}> -- wybierz -- </option>
                                        {/* @ts-expect-error */}
                                        {teams[el].map((team) => <option value={team}>{team}</option>)}
                                    </Form.Select>
                                    : <p className='text-muted'>{(userWinners && userWinners[el]) || 'nie obstawiono'}</p>
                                }
                            </Form.Group>
                        </div>
                    ))}
                </div>

                <div className="row mb-3">
                    <div className='col d-flex justify-content-end'>
                        {isEditMode 
                            ? <>
                                <Button variant='secondary' onClick={() => setEditMode(false)}>Cancel</Button>
                                <Button variant='success' onClick={handleSaveClick}>Save</Button>
                            </>
                            : <Button onClick={() => setEditMode(true)}>Edytuj</Button>
                        }   
                    </div>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}