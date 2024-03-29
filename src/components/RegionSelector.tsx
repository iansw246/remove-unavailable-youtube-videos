import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import regionListResponse from "../data/regions";
import { defaultRegion } from "../data/regionOptions";
import { matchSorter } from "match-sorter";
import type { MatchSorterOptions } from "match-sorter";

export interface Props
  extends Omit<
    AutocompleteProps<Region, false, false, false>,
    | "value"
    | "onChange"
    | "options"
    | "getOptionLabel"
    | "autoHighlight"
    | "renderInput"
  > {
  value: Region;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Region | null,
  ) => void | undefined;
}

const matchSorterOptions: MatchSorterOptions<Region> = {
  keys: ["snippet.name"],
};

export default function RegionSelector({ value, onChange, ...rest }: Props) {
  return (
    <Autocomplete
      options={regionListResponse.items}
      getOptionLabel={(option: Region) =>
        option.snippet.name + " (" + option.snippet.gl + ")"
      }
      isOptionEqualToValue={(option: Region, value: Region) =>
        option.id === value.id
      }
      autoHighlight
      value={value}
      renderInput={(params) => <TextField {...params} label="Region" />}
      onChange={onChange}
      filterOptions={(options, { inputValue }) =>
        matchSorter(options, inputValue, matchSorterOptions)
      }
      {...rest}
    />
  );
}

const SELECTED_REGION_LOCAL_STORAGE_KEY: string = "selectedRegion";

function loadOrInitializeSavedRegion(): Region {
  let savedRegionId = localStorage.getItem(SELECTED_REGION_LOCAL_STORAGE_KEY);
  if (savedRegionId === null) {
    savedRegionId = defaultRegion.id;
    localStorage.setItem(SELECTED_REGION_LOCAL_STORAGE_KEY, defaultRegion.id);
  }
  return (
    regionListResponse.items.find((region) => region.id === savedRegionId) ||
    defaultRegion
  );
}

/**
 * Save region persistently so that loadOrInitializeSavedRegion() will retrieve
 * this new region next time.
 * @param newRegion
 */
function saveRegion(newRegion: Region) {
  localStorage.setItem(SELECTED_REGION_LOCAL_STORAGE_KEY, newRegion.id);
}

export { loadOrInitializeSavedRegion, saveRegion };
