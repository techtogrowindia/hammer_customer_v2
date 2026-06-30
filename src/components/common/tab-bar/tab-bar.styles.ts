import { AppColors } from "@/core/theme/app-colors";
import { fontTokens } from "@/core/theme/typography";
import { StyleSheet } from "react-native";
import { Spacing } from "../spacing/spacing";

export default StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: 61,
    maxHeight: 73,
  },
  iconContainer: {
    padding: Spacing.spacing_02,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    textAlign: "center",
    color: AppColors.buttonPrimary,
    marginTop: Spacing.spacing_00,
    width: "auto",
    fontWeight: 700,
    lineHeight: fontTokens.lineHeight.line_height_00,
    fontFamily: fontTokens.fontFamily.bold,
    letterSpacing: fontTokens.letterSpacing.letter_spacing_01,
  },

  rewardsIconContainer: {
    marginTop: Spacing.spacing_03,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
