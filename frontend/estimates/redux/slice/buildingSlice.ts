import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// partial дулает все свойства необязательными, Pick выберает поля и делает их обязательными
type SelectedBuilding = Partial<Building> &
  Pick<Building, "name" | "code_building">;

const initialState: SelectedBuilding = {
  name: "Не выбран",
  code_building: "",
  id: undefined,
};

const buildingSlice = createSlice({
  name: "building",
  initialState,
  reducers: {
    setBuilding: (state, action: PayloadAction<SelectedBuilding>) => {
      console.log("Before", state);
      console.log("action.payload", action.payload);
      state = action.payload;
      console.log("after", state);
    },
  },
});
export const { setBuilding } = buildingSlice.actions;

export default buildingSlice.reducer;
