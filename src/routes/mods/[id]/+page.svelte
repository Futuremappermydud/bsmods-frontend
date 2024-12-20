<script lang="ts">
  import axios from "axios";
  import FilterView from "$lib/components/ui/filtering/FilterView.svelte";
  import type { ModData, Mods } from "$lib/types/Mods";
  import { searchModsIndex, createModsIndex } from "$lib/utils/search";
  import ModCardNeo from "$lib/components/ui/mods/ModCardNeo.svelte";
  import * as Pagination from "$lib/components/ui/pagination";
  import { ChevronLeftRegular, ChevronRightRegular } from "@svelte-fui/icons";
</script>

