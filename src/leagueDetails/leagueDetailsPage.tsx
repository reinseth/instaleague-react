import { definePage } from "../domainHelpers.ts";

export const leagueDetailsPage = definePage({
  id: "leagueDetails",
  route: "/leagues/:leagueId",
  query: (params) => ({
    matches: {
      player1: {},
      player2: {},
      $: {
        where: { id: String(params.leagueId) },
      },
    },
  }),
  render: (props) => {
    console.log(props);
    return <div>League details</div>;
  },
});
