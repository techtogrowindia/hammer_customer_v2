import { View } from "react-native";
import type { SpacerProps } from "./Spacer.types";

export const Spacer = ({ size, horizontal, vertical, style }: SpacerProps) => {
  return (
    <View
      style={[
        {
          width: horizontal ?? size ?? 0,
          height: vertical ?? size ?? 0,
        },
        style,
      ]}
    />
  );
};
