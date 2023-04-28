import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
// partial дулает все свойства необязательными, Pick выберает поля и делает их обязательными
type SelectedBuilding = Partial<Building> &
  Pick<Building, "name" | "code_building">;

interface IBuilding {
  building: SelectedBuilding;
}
// const initialState: SelectedBuilding = {
//   name: "Не выбран",
//   code_building: "",
//   id: undefined,
// };
const initialState: IBuilding = {
  building: { name: "Не выбран", code_building: "", id: undefined },
};

const buildingSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    setBuilding: (state, action: PayloadAction<SelectedBuilding>) => {
      state.building = action.payload;
    },
    getBuilding: (state) => {
      return state;
    },
  },
});
export const { setBuilding, getBuilding } = buildingSlice.actions;

// Получение выбранного объекта
export const ActiveBuilding = (state: RootState) => state.buildings.building;

export default buildingSlice.reducer;
