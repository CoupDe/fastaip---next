import { ImportVisrResponse } from "@/lib/api/postConfirmImportVisr";
import { UploadFileResponse } from "@/lib/api/uploadVisrFiles/postVisrFiles";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
export type UploadType = "ВИСР" | "ЕВР" | "Формы";
interface ImportState {
  error: string | null;
  detail: ImportVisrResponse[] | null;
  uploadType: UploadType;
}

const initialState: ImportState = {
  error: null,
  detail: null,
  uploadType: "ВИСР",
};

const importSlice = createSlice({
  name: "uploadVisr",
  initialState,
  reducers: {
    setImportError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setImportType: (state, action: PayloadAction<UploadType>) => {
    
      state.uploadType = action.payload;
    },
    setImportDataResponse: (
      state,
      action: PayloadAction<ImportVisrResponse[]>
    ) => {
      state.detail = action.payload;
    },
  },
});

export const { setImportDataResponse, setImportError, setImportType } =
  importSlice.actions;

export const SelectImportData = (state: RootState) => state.uploadVisr.detail;
export const SelectImportError = (state: RootState) => state.uploadVisr.error;
export const SelectedImportType = (state: RootState) =>
  state.uploadVisr.uploadType;
export default importSlice.reducer;
