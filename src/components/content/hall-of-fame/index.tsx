import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import CardGroup from "react-bootstrap/CardGroup";

import halloffameImg from "../../../assets/halloffame.png";
import mundial2018Img from "../../../assets/mundial2018.jpg";
import mundial2022Img from "../../../assets/mundial2022.jpeg";
import euro2024Img from "../../../assets/euro2024.jpeg";
import euro2020Img from "../../../assets/euro2020.jpeg";
import mundial2026Img from "../../../assets/mundial2026.png";

export const HallOfFame = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <Image className="mb-5" src={halloffameImg} />
      <CardGroup className="w-50">
        <Card className="p-5 ">
          <Card.Img variant="top" src={mundial2026Img} />
          <Card.Body>
            <Card.Title>Mundial 2026</Card.Title>
            <Card.Text>...</Card.Text>
            <Card.Text>?? pkt</Card.Text>
          </Card.Body>
        </Card>

        {/* <Card className="p-5">
          <Card.Img variant="top" src={mundial2022Img} />
          <Card.Body>
            <Card.Title>Mundial 2022</Card.Title>
            <Card.Text>Domson, Przemo</Card.Text>
            <Card.Text>83 pkt</Card.Text>
          </Card.Body>
        </Card> */}
      </CardGroup>

      <CardGroup>
        <Card className="p-5">
          <Card.Img variant="top" src={euro2024Img} />
          <Card.Body>
            <Card.Title>Euro 2024</Card.Title>
            <Card.Text>Ciacho</Card.Text>
            <Card.Text>63 pkt</Card.Text>
          </Card.Body>
        </Card>

        <Card className="p-5">
          <Card.Img variant="top" src={mundial2022Img} />
          <Card.Body>
            <Card.Title>Mundial 2022</Card.Title>
            <Card.Text>Domson, Przemo</Card.Text>
            <Card.Text>83 pkt</Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
      <CardGroup>
        <Card className="p-5">
          <Card.Img variant="top" src={euro2020Img} />
          <Card.Body>
            <Card.Title>Euro 2020</Card.Title>
            <Card.Text>Karol</Card.Text>
            <Card.Text>69 pkt</Card.Text>
          </Card.Body>
        </Card>

        <Card className="p-5">
          <Card.Img variant="top" src={mundial2018Img} />
          <Card.Body>
            <Card.Title>Mundial 2018</Card.Title>
            <Card.Text>Rysiu</Card.Text>
            <Card.Text>84 pkt</Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
    </div>
  );
};
