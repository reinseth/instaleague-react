import type {AppStore, EventDispatcher, Match, Player} from "../domain.ts";
import {transact, updateEntity} from "../domainHelpers.ts";


export type MatchViewProps = {
    dispatch: EventDispatcher;
    store: AppStore;
    match?: Match,
    player1?: Player;
    player2?: Player;
};

export type MatchProps = {
    player1?: Player;
    player2?: Player;
    match?: Match;
    goBack: () => void;
    incScore1: () => void;
    incScore2: () => void;
    decScore1: () => void;
    decScore2: () => void;
    toggleMatchStatus: () => void;
};


export function prepMatchView(props: MatchViewProps): MatchProps {
    return {
        player1: props.player1,
        player2: props.player2,
        match: props.match,
        goBack: () => props.dispatch([{type: "navigate", pageId: "leagues"}]),
        incScore1: () => props.dispatch([
            transact([
                updateEntity("matches", props.match!.id, {
                    score1: (props.match?.score1 ?? 0) + 1,
                }),
            ]),
        ]),
        incScore2: () => props.dispatch([
            transact([
                updateEntity("matches", props.match!.id, {
                    score2: (props.match?.score2 ?? 0) + 1,
                }),
            ]),
        ]),
        decScore1: () => props.dispatch([
            transact([
                updateEntity("matches", props.match!.id, {
                    score1: (props.match?.score1 ?? 0) - 1,
                }),
            ]),
        ]),
        decScore2: () => props.dispatch([
            transact([
                updateEntity("matches", props.match!.id, {
                    score2: (props.match?.score2 ?? 0) - 1,
                }),
            ]),
        ]),
        toggleMatchStatus: () => props.dispatch([transact([
            updateEntity("matches", props.match!.id, {finished: !props.match?.finished})
        ])])
    };
}
