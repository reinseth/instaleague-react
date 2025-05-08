import { definePage } from "../domainHelpers.ts";

export const leaguesPage = definePage({
  id: "leagues",
  route: "/leagues",
  query: () => ({ leagues: { players: {} } }),
  render: (props) => {
    console.log(props);
    return <div>Leagues</div>;
  },
});
