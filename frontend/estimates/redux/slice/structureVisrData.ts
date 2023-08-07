import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { StructureVisrResponse } from "@/const/interfaces";
// partial дулает все свойства необязательными, Pick выберает поля и делает их обязательными
type SelectedBuilding = Partial<Building> &
  Pick<Building, "name" | "code_building">;

interface IBuilding {
  visrs: StructureVisrResponse[];
}

const initialState: IBuilding = {
  visrs: [],
};

const visrSlice = createSlice({
  name: "visr",
  initialState,
  reducers: {
    setVisr: (state, action: PayloadAction<StructureVisrResponse[]>) => {
      state.visrs = action.payload;

      // console.log("state.buildings", current(state.buildings));
      // Ограничение списка 10ю уникальными записями
    },
  },
});
export const { setVisr } = visrSlice.actions;

// Получение выбранного объекта
export const getAllVisrs = (state: RootState) => state.visr.visrs;

export default visrSlice.reducer;
