import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import CardGroup from 'react-bootstrap/CardGroup';

import halloffameImg from '../../../assets/halloffame.png'
import mundial2018Img from '../../../assets/mundial2018.jpg'
import mundial2022Img from '../../../assets/mundial2022.jpeg'
import euro2024Img from '../../../assets/euro2024.jpeg'
import euro2020Img from '../../../assets/euro2020.jpeg'

export const HallOfFame = () => {
    return (
        <>
            <Image className='offset-4 col-4 mb-5' src={halloffameImg} />
            <CardGroup>
                <Card>
                    <Card.Img variant="top" src={euro2024Img} />
                    <Card.Body>
                        <Card.Title>Euro 2024</Card.Title>
                        <Card.Text>
                            ???
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Img variant="top" src={mundial2022Img} />
                    <Card.Body>
                        <Card.Title>Mundial 2022</Card.Title>
                        <Card.Text>
                            Domson, Przemo
                        </Card.Text>
                        <Card.Text>
                            83 pkt
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>
            <CardGroup>
                <Card>
                    <Card.Img variant="top" src={euro2020Img} />
                    <Card.Body>
                        <Card.Title>Euro 2020</Card.Title>
                        <Card.Text>
                            Karol
                        </Card.Text>
                        <Card.Text>
                            69 pkt
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Img variant="top" src={mundial2018Img} />
                    <Card.Body>
                        <Card.Title>Mundial 2018</Card.Title>
                        <Card.Text>
                            Rysiu
                        </Card.Text>
                        <Card.Text>
                            84 pkt
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>
        </>
    )
}