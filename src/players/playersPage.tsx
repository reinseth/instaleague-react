import { PlayersView } from "./playersComponents.tsx";
import { definePage } from "../domainHelpers.ts";

export const playersPage = definePage({
  id: "players",
  route: "/players/:id",
  query: () => ({ players: {} }),
  render: (props) => <PlayersView {...props} />,
});
