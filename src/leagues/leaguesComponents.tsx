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
    <div className={"list rounded-box shadow-md bg-base-100"}>
      {props.leagues.map((league) => {
        return (
          <div key={league.id} className={"list-row"}>
            <div className={"list-col-grow self-center"}>{league.name}</div>
          </div>
        );
      })}
    </div>
  );
}
