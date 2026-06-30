import type { DimensionValue, ViewStyle } from "react-native";
import type { SpacingType } from "../spacing/spacing.types";
export interface SpacerProps {
  size?: DimensionValue | SpacingType;
  horizontal?: DimensionValue | SpacingType;
  vertical?: DimensionValue | SpacingType;
  style?: ViewStyle;
}
