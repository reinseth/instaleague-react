import type { AppStore, EventDispatcher, Player } from "../domain.ts";
import {
  deleteEntity,
  transact,
  updateEntity,
  updateStore,
} from "../domainHelpers.ts";

export type PlayerFormState = {
  id?: string;
  name?: { value?: string; error?: string };
};

export type PlayersState = {
  newPlayer?: PlayerFormState;
  editPlayer?: PlayerFormState;
};

export type PlayersViewProps = {
  dispatch: EventDispatcher;
  data?: { players?: Player[] };
  store: AppStore;
};

export type PlayersListProps = {
  players: Player[];
  form?: PlayerFormProps;
  deletePlayer: (id: string) => void;
  editPlayer: (id: string) => void;
};

export type PlayerFormProps = {
  id?: string;
  name: { value?: string; error?: string; onChange: (value: string) => void };
  onSubmit: () => void;
};

function containsName(players: Player[], name: string) {
  return players.some(
    (player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
}

function validateName(
  context: PlayersViewProps,
  form: PlayerFormState | undefined,
): string | undefined {
  const existingPlayers = (context.data?.players ?? []).filter(
    (p) => p.id !== form?.id,
  );
  switch (true) {
    case !form?.name?.value?.trim():
      return "Required";
    case containsName(existingPlayers, form?.name?.value ?? ""):
      return "Already exists";
  }
}

export function prepPlayerForm(
  props: PlayersViewProps,
  formId: keyof PlayersState,
): PlayerFormProps {
  const form = props.store[formId];
  return {
    id: form?.id,
    name: {
      ...form?.name,
      value: form?.name?.value ?? "",
      onChange: (value) =>
        props.dispatch([
          updateStore({
            [formId]: {
              ...form,
              name: {
                ...form?.name,
                value,
                error: form?.name?.error
                  ? validateName(props, {
                      ...form,
                      name: { ...form?.name, value },
                    })
                  : undefined,
              },
            },
          }),
        ]),
    },
    onSubmit: () => {
      const error = validateName(props, form);
      if (error) {
        props.dispatch([
          updateStore({
            [formId]: {
              ...form,
              name: { ...form?.name, error },
            },
          }),
        ]);
      } else {
        props.dispatch([
          transact([
            updateEntity("players", form?.id ?? "new-id", {
              name: form?.name?.value ?? "",
            }),
          ]),
          updateStore({ [formId]: undefined }),
        ]);
      }
    },
  };
}

export function prepPlayersList(props: PlayersViewProps): PlayersListProps {
  return {
    players: props.data?.players ?? [],
    form: props.store.editPlayer
      ? prepPlayerForm(props, "editPlayer")
      : undefined,
    deletePlayer: (id) =>
      props.dispatch([transact([deleteEntity("players", id)])]),
    editPlayer: (id) =>
      props.dispatch([
        updateStore({
          editPlayer: {
            id,
            name: {
              value: props.data?.players?.find((p) => p.id === id)?.name ?? "",
            },
          },
        }),
      ]),
  };
}
