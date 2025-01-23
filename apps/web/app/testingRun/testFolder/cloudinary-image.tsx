"use client";
import { CldImage } from "next-cloudinary";
import React from "react";

// Super Generic Function
export function CloundinaryImage(props: any) {
  return <CldImage {...props} />;
}
