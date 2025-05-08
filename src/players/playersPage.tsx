import { PlayersView } from "./playersComponents.tsx";
import { definePage } from "../domainHelpers.ts";

export const playersPage = definePage({
  id: "players",
  route: "/players",
  query: () => ({ players: {} }),
  render: (props) => <PlayersView {...props} />,
});
