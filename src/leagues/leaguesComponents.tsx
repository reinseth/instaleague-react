import { TextInput } from "../players/playersComponents.tsx";
import type { LeagueFormProps, LeaguesListProps } from "./leaguesDomain.ts";

export const AddLeagueForm = (props: LeagueFormProps) => {
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
    >
      <TextInput
        name={"name"}
        placeholder={"Enter league name"}
        {...props.name}
      />
      <button className="btn btn-primary" type={"submit"}>
        Add
      </button>
    </form>
  );
};

export function LeaguesList(props: LeaguesListProps) {
  return (
    <div className="flex flex-col gap-4">
      {props.leagues.map((league) => {
        return (
          <div key={league.name} className={"flex flex-col gap-4"}>
            <h3 className={"text-lg font-semibold"}>{league.name}</h3>
            <table className={"table"}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>W</th>
                  <th>L</th>
                  <th>P</th>
                </tr>
              </thead>
              <tbody>
                {league.results.map((result) => (
                  <tr key={result.playerName}>
                    <td>{result.playerName}</td>
                    <td>{result.wins}</td>
                    <td>{result.losses}</td>
                    <td>{result.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
            <h3 className={"text-lg font-semibold"}>Matches</h3>
            <div className={"list rounded-box shadow-md bg-base-100"}>
              {league.matches.map((match) => (
                <div
                  key={match.id}
                  className={"list-row"}
                  role={"button"}
                  tabIndex={0}
                  onClick={match.onOpen}
                >
                  <div className={"list-col-grow self-center"}>
                    {match.player1} - {match.player2}
                  </div>
                  <div>
                    {match.score1 || match.score2
                      ? `${match.score1 ?? 0} - ${match.score2 ?? 0}`
                      : ""}
                  </div>
                  <div>{match.finished ? "✅" : ""}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
