import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  ErrorImportResponse,
  IDetailResponseImport,
  ImportVisrResponse,
} from "@/lib/api/postAcceptImport";

interface ImportState {
  error: string | null;
  detail: ImportVisrResponse[] | null;
}

const initialState: ImportState = {
  error: null,
  detail: null,
};

const importSlice = createSlice({
  name: "uploadVisr",
  initialState,
  reducers: {
    setImportError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setImportDataResponse: (
      state,
      action: PayloadAction<ImportVisrResponse[]>
    ) => {
      state.detail = action.payload;
    },
  },
});

export const { setImportDataResponse, setImportError } = importSlice.actions;

export const SelectImportData = (state: RootState) => state.uploadVisr.detail;
export const SelectImportError = (state: RootState) => state.uploadVisr.error;

export default importSlice.reducer;
