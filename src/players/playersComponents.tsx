import { Icon } from "../icons.tsx";
import {
  type AddPlayerFormProps,
  type PlayersListProps,
  type PlayersViewProps,
  prepAddPlayerForm,
  prepPlayersList,
} from "./playersDomain.ts";
import { classNames } from "../utils.ts";
import type { InputHTMLAttributes } from "react";

function TextInput({
  error,
  onChange,
  ...props
}: {
  onChange: (value: string) => void;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div className="flex flex-col gap-1 grow">
      <input
        type="text"
        className={classNames("input", "w-full", error && "input-error")}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {error && <div className="text-xs text-error">{error}</div>}
    </div>
  );
}

function AddPlayerForm(props: AddPlayerFormProps) {
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
        placeholder={"Enter player name"}
        {...props.fields.name}
      />
      <button className="btn btn-primary" type={"submit"}>
        Add
      </button>
    </form>
  );
}

function PlayersList(props: PlayersListProps) {
  return (
    <div className={"list rounded-box shadow-md bg-base-100"}>
      {props.players.map((player) => (
        <div key={player.id} className={"list-row"}>
          <div className={"list-col-grow self-center"}>{player.name}</div>
          <button
            className={"btn btn-ghost"}
            onClick={(event) => {
              event.stopPropagation();
              props.deletePlayer(player.id);
            }}
          >
            <Icon name={"x"} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function PlayersView(props: PlayersViewProps) {
  return (
    <div className={"container mx-auto flex flex-col gap-4 mt-4 p-4"}>
      <h1 className={"text-xl"}>Players</h1>
      <AddPlayerForm {...prepAddPlayerForm(props)} />
      <PlayersList {...prepPlayersList(props)} />
    </div>
  );
}
