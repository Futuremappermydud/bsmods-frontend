import { getContext, setContext } from "svelte";
import { type Writable } from "svelte/store";
import type { Layout } from "./types";

const key = "fui_tab_list_context";

export type TabListContext = {
  disabled$: Writable<boolean>;
  required$: Writable<boolean>;
  value$: Writable<unknown>;
  name$: Writable<string | undefined>;
  layout$: Writable<Layout>;

  methods: {
    select: (value: string) => void;
  };
};

export function getTabListContext() {
  return getContext(key) as TabListContext;
}

export function setTabListContext(context: TabListContext): TabListContext {
  return setContext(key, context);
}
