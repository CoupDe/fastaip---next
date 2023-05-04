"use client";

import { persistor } from "@/redux/store/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";

export default function PersistorContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
