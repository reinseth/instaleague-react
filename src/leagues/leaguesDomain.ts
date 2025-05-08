import type { AppEvent, League } from "../domain";
import { transact, updateEntity, updateStore } from "../domainHelpers.ts";
import { containsName, type PlayersState } from "../players/playersDomain.ts";

export type LeagueFormState = {
  name?: { value?: string; error?: string };
};

export type LeaguesState = {
  newLeague?: LeagueFormState;
};

export type LeagueFormProps = {
  name: { value?: string; error?: string; onChange: (value: string) => void };
  onSubmit: () => void;
  onCancel?: () => void;
};

export const prepLeagueForm = (props: {
  store: PlayersState & LeaguesState;
  dispatch: (events: AppEvent[]) => void;
  leagues?: League[];
}): LeagueFormProps => {
  const form = props.store.newLeague;

  return {
    name: {
      value: form?.name?.value ?? "",
      error: form?.name?.error,
      onChange: (value) => {
        props.dispatch([
          updateStore({
            newLeague: {
              ...form,
              name: {
                value,
                error: form?.name?.error
                  ? validateName(props.leagues, value)
                  : undefined,
              },
            },
          }),
        ]);
      },
    },
    onSubmit: () => {
      const error = validateName(props.leagues, form?.name?.value);
      if (error) {
        props.dispatch([
          updateStore({
            newLeague: {
              ...form,
              name: {
                ...form?.name,
                error,
              },
            },
          }),
        ]);
      } else
        props.dispatch([
          transact([
            updateEntity("leagues", "new-id", { name: form?.name?.value }),
          ]),
          updateStore({ newLeague: undefined }),
        ]);
    },
  };
};

function validateName(
  leagues: League[] | undefined,
  value: string | undefined,
): string | undefined {
  switch (true) {
    case !value?.trim():
      return "Required";
    case containsName(leagues ?? [], value ?? ""):
      return "Already exists";
  }
}

export type LeaguesListProps = {
  leagues: League[];
};

export const prepLeaguesListForm = (props: {
  store: PlayersState & LeaguesState;
  dispatch: (events: AppEvent[]) => void;
  leagues?: League[];
}): LeaguesListProps => {
  return {
    leagues: props.leagues ?? [],
  };
};
