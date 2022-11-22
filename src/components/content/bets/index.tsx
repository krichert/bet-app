import { useEffect, useState} from "react"
import groupBy from 'lodash/groupBy';
import moment, { Moment } from 'moment-timezone';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';

import { DATABASE_URL } from "../../../constants";
import { WinnerAcordion } from "./winners";
import { MatchesAcordion } from "./matches";
import { Auth } from "../../common/auth";

export type Match = {
    id: string;
    teamA: string;
    scoreA: string | null;
    teamB: string;
    scoreB: string | null;
    date: string;
}

export const Bets = () => {
    const [today, setToday] = useState<Moment | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);

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

    useEffect(() => {
        fetch(`${DATABASE_URL}/matches.json`)
            .then(r => r.json())
            .then(matchesObj => {
                const formattedMatches = Object.keys(matchesObj).map((key) => ({ ...matchesObj[key], id: key}));
                setMatches(formattedMatches);
            })
    }, []);

    const firstMatchDate: string = matches.reduce((acc, curr) => {
        return moment(curr.date).diff(acc) > 0 ? acc : curr.date;
    }, matches[0] ? matches[0].date : '');

    const grouppedMatches = groupBy(matches, (match) => {
        return moment.utc(match.date).tz('Europe/Warsaw').format("DD/MM/YYYY")
    });

    return <Auth>
        { 
            matches.length === 0 
                ? (
                    <div className="m-5 d-flex justify-content-center align-items-center"><Spinner /></div>
                )
                : (
                    <Accordion defaultActiveKey={today?.format("DD/MM/YYYY")} alwaysOpen>
                        <WinnerAcordion isBlocked={today ? moment(today).isAfter(firstMatchDate) : true} />
                        {
                            Object.keys(grouppedMatches).map(matchesDay => (
                                <MatchesAcordion key={matchesDay} matches={grouppedMatches[matchesDay]} today={today} day={matchesDay} />
                            ))
                        }
                    </Accordion>
                )
        }
    </Auth>
}
