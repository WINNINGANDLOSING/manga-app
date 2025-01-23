"use client";
import { CldImage } from "next-cloudinary";
import React from "react";

// export function CloundinaryImage({
//   public_id,
//   ...props
// }: {
//   public_id: string;
// }) {
//   return (
//     <CldImage
//       key={public_id}
//       width="500"
//       height="300"
//       {...props}
//       src={public_id}
//       sizes="100vw"
//       alt="Chapter 1"
//     />
//   );
// }

// Super Generic Function
export function CloundinaryImage(props: any) {
  return <CldImage {...props} />;
}
