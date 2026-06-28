import { useState, useEffect, ChangeEvent } from "react";
import moment from "moment-timezone";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { DATABASE_URL } from "../../../constants";

export const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [matchesObj, setMatchesObj] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;

    fetch(`${DATABASE_URL}/matches.json`)
      .then((r) => r.json())
      .then((obj) => {
        // coerce numeric scores to strings, keep missing scores as null
        const normalized: any = Object.fromEntries(
          Object.keys(obj).map((key) => {
            const item = obj[key] || {};
            return [
              key,
              {
                ...item,
                scoreA: item.scoreA != null ? String(item.scoreA) : null,
                scoreB: item.scoreB != null ? String(item.scoreB) : null,
              },
            ];
          }),
        );

        setMatchesObj(normalized);
      });
  }, [authenticated]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (password === "ananasek") {
      setAuthenticated(true);
    } else {
      alert("Złe hasło");
    }
  };

  if (!authenticated) {
    return (
      <div className="m-5 d-flex justify-content-center align-items-center">
        <form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>Hasło</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e: ChangeEvent<any>) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mt-3 d-flex justify-content-end">
            <Button type="submit">Zaloguj</Button>
          </div>
        </form>
      </div>
    );
  }

  if (!matchesObj) {
    return (
      <div className="m-5 d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  const formattedMatches = Object.keys(matchesObj).map((key) => ({
    ...matchesObj[key],
    id: key,
    scoreA: matchesObj[key].scoreA != null ? matchesObj[key].scoreA : "",
    scoreB: matchesObj[key].scoreB != null ? matchesObj[key].scoreB : "",
  }));

  const grouppedMatches = formattedMatches.reduce((acc: any, match: any) => {
    const day = moment.utc(match.date).tz("Europe/Warsaw").format("DD/MM/YYYY");
    acc[day] = acc[day] || [];
    acc[day].push(match);
    return acc;
  }, {});

  const handleScoreChange = (id: string, field: string, value: string) => {
    const newVal = value === "" ? null : value;
    setMatchesObj({
      ...matchesObj,
      [id]: { ...matchesObj[id], [field]: newVal },
    });
  };

  const handleSaveAll = () => {
    setLoading(true);
    fetch(`${DATABASE_URL}/matches.json`, {
      method: "PUT",
      body: JSON.stringify(matchesObj),
    })
      .then(() => {
        setLoading(false);
        alert("Zapisano");
      })
      .catch(() => {
        setLoading(false);
        alert("Błąd podczas zapisu");
      });
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Admin - edycja wyników</h4>
        <div>
          <Button variant="danger" onClick={() => setAuthenticated(false)} className="me-2">
            Wyloguj
          </Button>
          <Button onClick={handleSaveAll} disabled={loading}>
            {loading ? "Zapis..." : "Zapisz wszystkie"}
          </Button>
        </div>
      </div>

      <Accordion
        defaultActiveKey={moment().tz("Europe/Warsaw").format("DD/MM/YYYY")}
        alwaysOpen
      >
        {Object.keys(grouppedMatches)
          .slice()
          .sort((a, b) =>
            moment
              .tz(a, "DD/MM/YYYY", "Europe/Warsaw")
              .diff(moment.tz(b, "DD/MM/YYYY", "Europe/Warsaw")),
          )
          .map((matchesDay) => (
            <Accordion.Item eventKey={matchesDay} key={matchesDay}>
              <Accordion.Header>Mecze {matchesDay}</Accordion.Header>
              <Accordion.Body>
                {grouppedMatches[matchesDay].map((match: any) => (
                  <div className="row mb-3" key={match.id}>
                    <div className="col-4">{match.teamA}</div>
                    <div className="col-4 d-flex justify-content-center">
                      <Form.Control
                        name="scoreA"
                        type="number"
                        value={matchesObj[match.id].scoreA ?? ""}
                        onChange={(e: ChangeEvent<any>) =>
                          handleScoreChange(match.id, "scoreA", e.target.value)
                        }
                      />
                      <div className="mx-2 align-self-center">:</div>
                      <Form.Control
                        name="scoreB"
                        type="number"
                        value={matchesObj[match.id].scoreB ?? ""}
                        onChange={(e: ChangeEvent<any>) =>
                          handleScoreChange(match.id, "scoreB", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-4 d-flex justify-content-end">{match.teamB}</div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default Admin;
