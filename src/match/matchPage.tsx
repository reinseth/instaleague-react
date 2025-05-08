import {definePage} from "../domainHelpers.ts";
import {MatchView} from "./matchComponents.tsx";
import {prepMatchView} from "./matchDomain.ts";
import type {Match, Player} from "../domain.ts";

export const matchPage = definePage({
    id: "match",
    route: "/matches/:matchId",
    query: (params) => ({
        matches: {
            player1: {},
            player2: {},
            $: {
                where: {id: String(params.matchId)},
            },
        },
    }),
    render: (props) => {
        console.log(props);
        return <MatchView {...prepMatchView({ ...props, player1: examplePlayer1, player2: examplePlayer2, match: exampleMatch })} />;
    },
});

const examplePlayer1: Player = {
    id: "1",
    name: "Nasimjon"
}
const examplePlayer2: Player = {
    id: "2",
    name: "Christian"
}

const exampleMatch: Match = {
    id: "1",
    score1: 1,
    score2: 2,
    finished: false,
}
