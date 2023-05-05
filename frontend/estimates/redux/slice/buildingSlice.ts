var toSpliced = require("array.prototype.tospliced");
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
// const initialState: SelectedBuilding = {
//   name: "Не выбран",
//   code_building: "",
//   id: undefined,
// };
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

      // Ограничение списка 10ю уникальными записями
      if (current(state.buildings).includes(action.payload)) {
        state.buildings = [
          ...current(state.buildings).filter((item) => item !== action.payload),
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
export const SelectedBuildingList = (state: RootState) =>
  state.building.buildings;
export default buildingSlice.reducer;
