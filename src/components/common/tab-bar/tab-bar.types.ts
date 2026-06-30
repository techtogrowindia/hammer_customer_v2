export type TabBarItemProps = {
  icon: string;
  label: string;
  focused: boolean;
  badge?: number;
  onPress: () => void;
};
