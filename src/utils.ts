import { DATABASE_URL } from './constants';
import { Match } from "./components/content/bets";

export const calculatePoints = ({
    betA, betB, scoreA, scoreB, stage, round
}: {
    betA: string | null,
    betB: string | null,
    scoreA: string | null,
    scoreB: string | null,
    stage?: string | null,
    round?: string | null
}) => {
    const isGroup = stage === 'group';

    const exactPoints = isGroup ? 2 : 3; // exact score points
    const outcomePoints = 1; // correct outcome (including draw)

    function isQuarterOrLater(stage?: string | null) {
        const s = (stage || '').toLowerCase();
        if (s.includes('quarter') || s.includes('semi') || s === 'final') return true;
        return false;
    }

    const multiplier = isQuarterOrLater(stage) ? 2 : 1;

    if (betA == null || betB == null || scoreA == null || scoreB == null) {
        if (scoreA != null && scoreB != null) {
            const parsedScoreA = parseInt(scoreA);
            const parsedScoreB = parseInt(scoreB);

            if (parsedScoreA - parsedScoreB === 0) {
                return outcomePoints * multiplier;
            }
        }

        return 0;
    }

    const parsedBetA = parseInt(betA);
    const parsedBetB = parseInt(betB);
    const parsedScoreA = parseInt(scoreA);
    const parsedScoreB = parseInt(scoreB);

    let points = 0;

    if (parsedBetA === parsedScoreA && parsedBetB === parsedScoreB) {
        points = exactPoints;
    } else if (
        (parsedBetA - parsedBetB > 0 && parsedScoreA - parsedScoreB > 0)
        || (parsedBetA - parsedBetB < 0 && parsedScoreA - parsedScoreB < 0)
        || (parsedBetA - parsedBetB === 0 && parsedScoreA - parsedScoreB === 0)
    ) {
        points = outcomePoints;
    }

    return points * multiplier;
}

export const calculateAllPoints = (matches: Match[], userBets: { [matchId: string]: any } | null) => {
    if (!userBets) {
        return 0;
    }

    return matches.reduce((acc, match: Match) => {
        const betA = userBets[match.id] && userBets[match.id].betA;
        const betB = userBets[match.id] && userBets[match.id].betB;

        return acc + calculatePoints({ scoreA: match.scoreA, scoreB: match.scoreB, betA, betB, stage: match.stage });
    }, 0);
}

export const calculateAllWinnerPoints = (winners: any, userWinners: any) => {
    if (!winners || !userWinners) {
        return 0;
    }
    let result = 0;

    Object.keys(winners).forEach(key => {
        // group winners (A-L) -> 2 points
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].includes(key)) {
            if (winners[key] === userWinners[key]) {
                result += 2;
            }
            return;
        }

        if (key === 'winner') {
            if (winners.winner === userWinners.winner) {
                result += 5;
            } else if (winners.second && winners.second === userWinners.winner) {
                // user predicted winner who actually finished second
                result += 2;
            }
            return;
        }

        // fallback: if key exists and matches, give 0 (or could be extended)
        if (winners[key] === userWinners[key]) {
            result += 0;
        }
    })

    return result;
}