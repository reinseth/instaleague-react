import { definePage } from "../domainHelpers.ts";

export const matchPage = definePage({
  id: "match",
  route: "/matches/:matchId",
  query: (params) => ({
    matches: {
      player1: {},
      player2: {},
      $: {
        where: { id: String(params.matchId) },
      },
    },
  }),
  render: (props) => {
    console.log(props);
    return <div>Match</div>;
  },
});
