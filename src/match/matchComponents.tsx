import type {MatchProps} from "./matchDomain.ts";

export function MatchView(props: MatchProps) {
    return (
        <div className={"container mx-auto max-w-2xl flex flex-col gap-24 mt-4 p-4 text-4xl"}>
            <div className={"flex gap-12"}>
                <button className="btn btn-primary btn-p btn-xl" type={"button"} onClick={props.goBack}>
                    Back
                </button>
                <h1 className={"flex justify-center text-6xl"}>Match</h1>
            </div>
            <div className={"flex justify-center"}>{props.player1?.name} - {props.player2?.name}</div>
            <div className={"flex gap-12 justify-center"}>
                <MatchScore decScore={props.decScore1} incScore={props.incScore1} score={props.match?.score1} />
                <div className={"flex flex-col justify-center"}>
                    -
                </div>
                <MatchScore decScore={props.decScore2} incScore={props.incScore2} score={props.match?.score2} />
            </div>
            <div className={"flex justify-center gap-6"}>
                <input type={"checkbox"} className={"size-10"} id={"done"} onChange={props.toggleMatchStatus}
                       checked={props.match?.finished === true}/> <label htmlFor="done">Done</label>
            </div>
        </div>
    );
}

function MatchScore( {decScore, incScore, score}: {decScore: () => void, incScore: () => void, score?: number}) {
    return (
        <div className={"flex flex-col gap-4"}>
            <button className="btn btn-primary btn-p btn-xl" type={"submit"} onClick={decScore}>
                -
            </button>
            <span className={"text-center"}>{score}</span>
            <button className="btn btn-primary btn-p btn-xl" type={"submit"} onClick={incScore}>
                +
            </button>
        </div>
    );
}
