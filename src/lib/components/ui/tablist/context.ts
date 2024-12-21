import { getContext, setContext } from "svelte";
import { type Writable, writable } from "svelte/store";
import type { Layout } from "./types";

const key = "fui_tab_list_context";

export type TabListContext = {
  disabled$: Writable<boolean>;
  required$: Writable<boolean>;
  value$: Writable<unknown>;
  name$: Writable<string | undefined>;
  layout$: Writable<Layout>;
};

const builders: Record<keyof TabListContext, () => any> = {
  disabled$: () => writable(false),
  required$: () => writable(false),
  name$: () => writable(undefined),
  value$: () => writable(undefined),
  layout$: () => writable("vertical"),
};

function getDefaultContext(context: Partial<TabListContext> = {}) {
  const keys: Set<keyof TabListContext> = new Set([
    "disabled$",
    "required$",
    "value$",
    "name$",
  ]);

  Object.keys(context).forEach((key) => keys.delete(key));

  for (const key of keys) {
    context[key] = builders[key]();
  }

  return context as TabListContext;
}

export function getTabListContext() {
  return (getContext(key) || getDefaultContext()) as TabListContext;
}

export function setTabListContext(
  context: Partial<TabListContext> = {},
): TabListContext {
  return setContext(key, getDefaultContext(context));
}
