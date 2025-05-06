import type { AppStore, EventDispatcher, Player } from "../domain.ts";
import {
  deleteEntity,
  transact,
  updateEntity,
  updateStore,
} from "../domainHelpers.ts";

export type PlayersState = {
  newPlayer?: {
    name?: string;
    error?: string;
  };
  editPlayer?: {
    id?: string;
    name?: string;
    error?: string;
  };
};

export type PlayersViewProps = {
  dispatch: EventDispatcher;
  data?: { players?: Player[] };
  store: AppStore;
};

export type PlayersListProps = {
  players: Player[];
  deletePlayer: (id: string) => void;
};

export type AddPlayerFormProps = {
  fields: {
    name: { value: string; error?: string; onChange: (value: string) => void };
  };
  onSubmit: () => void;
};

export function prepPlayersList(props: PlayersViewProps): PlayersListProps {
  return {
    players: props.data?.players ?? [],
    deletePlayer: (id) =>
      props.dispatch([transact([deleteEntity("players", id)])]),
  };
}

function containsName(players: Player[], name: string) {
  return players.some(
    (player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
}

function validateName(
  context: PlayersViewProps,
  form: PlayersState["newPlayer"] | PlayersState["editPlayer"],
): string | undefined {
  switch (true) {
    case !form?.name?.trim():
      return "Required";
    case containsName(context.data?.players ?? [], form?.name ?? ""):
      return "Already exists";
  }
}

export function prepAddPlayerForm(props: PlayersViewProps): AddPlayerFormProps {
  return {
    fields: {
      name: {
        value: props.store.newPlayer?.name ?? "",
        error: props.store.newPlayer?.error,
        onChange: (value) =>
          props.dispatch([
            updateStore({
              newPlayer: {
                ...props.store.newPlayer,
                name: value,
                error: props.store.newPlayer?.error
                  ? validateName(props, {
                      ...props.store.newPlayer,
                      name: value,
                    })
                  : undefined,
              },
            }),
          ]),
      },
    },
    onSubmit: () => {
      const error = validateName(props, props.store.newPlayer);
      if (error) {
        props.dispatch([
          updateStore({
            newPlayer: { ...props.store.newPlayer, error },
          }),
        ]);
      } else {
        props.dispatch([
          transact([
            updateEntity("players", "new-id", {
              name: props.store.newPlayer?.name ?? "",
            }),
          ]),
          updateStore({ newPlayer: undefined }),
        ]);
      }
    },
  };
}
