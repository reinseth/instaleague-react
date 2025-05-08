import { definePage } from "../domainHelpers.ts";
import { prepLeagueForm, prepLeaguesListForm } from "./leaguesDomain.ts";
import { AddLeagueForm, LeaguesList } from "./leaguesComponents.tsx";

export const leaguesPage = definePage({
  id: "leagues",
  route: "/leagues",
  query: () => ({ leagues: { players: {} } }),
  render: (props) => {
    console.log(props);
    return (
      <div>
        <div className={"container mx-auto flex flex-col gap-4 mt-4 p-4"}>
          <h1 className={"text-xl"}>Leagues</h1>
          <AddLeagueForm
            {...prepLeagueForm({
              store: props.store,
              dispatch: props.dispatch,
              leagues: props.data?.leagues,
            })}
          />
          <LeaguesList
            {...prepLeaguesListForm({
              store: props.store,
              dispatch: props.dispatch,
              leagues: props.data?.leagues,
            })}
          />
        </div>
      </div>
    );
  },
});
