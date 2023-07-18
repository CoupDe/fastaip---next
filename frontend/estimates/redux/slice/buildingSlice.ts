
import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
// partial дулает все свойства необязательными, Pick выберает поля и делает их обязательными
type SelectedBuilding = Partial<Building> &
  Pick<Building, "name" | "code_building">;

interface IBuilding {
  building: SelectedBuilding;
  buildings: Building[];
}

const initialState: IBuilding = {
  building: { name: "Не выбран", code_building: "", id: undefined },
  buildings: [],
};

const buildingSlice = createSlice({
  name: "building",
  initialState,
  reducers: {
    setBuilding: (state, action: PayloadAction<Building>) => {
      state.building = action.payload;

      // console.log("state.buildings", current(state.buildings));
      // Ограничение списка 10ю уникальными записями
      if (
        state.buildings.some((building) => building.id === action.payload.id)
      ) {
        state.buildings = [
          ...current(state.buildings).filter(
            (item) => item.id !== action.payload.id
          ),
          action.payload,
        ].slice(-10);
      } else {
        state.buildings = [...state.buildings, action.payload].slice(-10);
      }
    },
  },
});
export const { setBuilding } = buildingSlice.actions;

// Получение выбранного объекта
export const ActiveBuilding = (state: RootState) => state.building.building;
export const ReverseBuildingList = (state: RootState) =>
  [...state.building.buildings].reverse();

export default buildingSlice.reducer;
