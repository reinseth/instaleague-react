import { Icon } from "../icons.tsx";
import {
  type PlayerFormProps,
  type PlayersListProps,
  type PlayersViewProps,
  prepPlayerForm,
  prepPlayersList,
} from "./playersDomain.ts";
import { classNames } from "../utils.ts";
import type { InputHTMLAttributes } from "react";
import type { Player } from "../domain.ts";

function TextInput({
  error,
  onChange,
  className,
  ...props
}: {
  onChange: (value: string) => void;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div className="flex flex-col gap-1 grow">
      <input
        type="text"
        className={classNames(
          className,
          "input",
          "w-full",
          error && "input-error",
        )}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {error && <div className="text-xs text-error">{error}</div>}
    </div>
  );
}

function AddPlayerForm(props: PlayerFormProps) {
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
        {...props.name}
      />
      <button className="btn btn-primary" type={"submit"}>
        Add
      </button>
    </form>
  );
}

function EditPlayerListItem(props: PlayerFormProps) {
  return (
    <form
      className="list-row"
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
    >
      <TextInput
        name={"name"}
        placeholder={"Enter player name"}
        className={"list-col-grow"}
        {...props.name}
      />
      <div className="flex gap-1">
        <button className="btn btn-primary" type={"submit"}>
          <Icon name={"check"} />
        </button>
        <button
          className="btn btn-ghost"
          type={"button"}
          onClick={props.onCancel}
        >
          <Icon name={"x"} />
        </button>
      </div>
    </form>
  );
}

function PlayerListItem(props: PlayersListProps & { player: Player }) {
  return (
    <div
      className={"list-row"}
      role={"button"}
      tabIndex={0}
      onClick={() => props.editPlayer(props.player.id)}
    >
      <div className={"list-col-grow self-center"}>{props.player.name}</div>
      <button
        className={"btn btn-ghost"}
        onClick={(event) => {
          event.stopPropagation();
          props.deletePlayer(props.player.id);
        }}
      >
        <Icon name={"x"} />
      </button>
    </div>
  );
}

function PlayersList(props: PlayersListProps) {
  return (
    <div className={"list rounded-box shadow-md bg-base-100"}>
      {props.players.map((player) => {
        return props.form?.id === player.id ? (
          <EditPlayerListItem key={player.id} {...props.form} />
        ) : (
          <PlayerListItem key={player.id} player={player} {...props} />
        );
      })}
    </div>
  );
}

export function PlayersView(props: PlayersViewProps) {
  return (
    <div className={"container mx-auto flex flex-col gap-4 mt-4 p-4"}>
      <h1 className={"text-xl"}>Players</h1>
      <AddPlayerForm {...prepPlayerForm(props, "newPlayer")} />
      <PlayersList {...prepPlayersList(props)} />
    </div>
  );
}
