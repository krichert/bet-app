import { DATABASE_URL } from './constants';
import { Match } from "./components/content/bets";

export const calculatePoints = ({
    betA, betB, scoreA, scoreB
}: {
    betA: string | null,
    betB: string | null,
    scoreA: string | null,
    scoreB: string | null,
}) => {
    if (betA == null || betB == null || scoreA == null || scoreB == null) {
        return 0;
    }

    const parsedBetA = parseInt(betA);
    const parsedBetB = parseInt(betB);
    const parsedScoreA = parseInt(scoreA);
    const parsedScoreB = parseInt(scoreB);

    if (parsedBetA === parsedScoreA && parsedBetB === parsedScoreB) {
        return 3;
    }

    if (
        (parsedBetA - parsedBetB > 0 && parsedScoreA - parsedScoreB > 0) 
        || (parsedBetA - parsedBetB < 0 && parsedScoreA - parsedScoreB < 0) 
        || (parsedBetA - parsedBetB === 0 && parsedScoreA - parsedScoreB === 0) 
    ) {
        return 1;
    }

    return 0;
}

export const calculateAllPoints = (matches: Match[], userBets: { [matchId: string]: any } | null) => {
    if (!userBets) {
        return 0;
    }

    return matches.reduce((acc, match: Match) => {
        const betA = userBets[match.id] && userBets[match.id].betA;
        const betB = userBets[match.id] && userBets[match.id].betB;

        return acc + calculatePoints({ scoreA: match.scoreA, scoreB: match.scoreB, betA, betB });
    }, 0);
}

export const calculateAllWinnerPoints = (winners: any, userWinners: any) => {
    if (!winners || !userWinners) {
        return 0;
    }

    let result = 0;

    Object.keys(winners).forEach(key => {
        if (winners[key] === userWinners[key]) {
            if (key === 'winner') {
                   result =+ 10;
            } else {
                    result =+ 5;
            }
        }
    })

    return result;
}