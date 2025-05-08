import { PlayersView } from "./playersComponents.tsx";
import { definePage } from "../domainHelpers.ts";

export const playersPage = definePage({
  id: "players",
  route: "/players",
  query: () => ({ players: {} }),
  render: (props) => (
    <PlayersView
      dispatch={props.dispatch}
      data={props.data}
      store={props.store}
    />
  ),
});
