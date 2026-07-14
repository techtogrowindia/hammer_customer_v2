import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { SectionHeader } from '@/components/home/header/section-header';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MenuItem, MenuSectionData } from '../profile.types';

interface MenuRowProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
  isLast?: boolean;
}

export function MenuRow({ item, onPress, isLast = false }: MenuRowProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowDivider,
        pressed && { backgroundColor: AppColors.warningLight },
      ]}
    >
      <CircleIcon Icon={item.Icon} size={42} iconSize={18} />
      <View style={styles.textWrap}>
        <Text style={styles.label}>{item.label}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      </View>
      <ChevronRight size={17} color={AppColors.textTertiary} strokeWidth={2} />
    </Pressable>
  );
}

interface MenuGroupProps {
  section: MenuSectionData;
  onItemPress: (item: MenuItem) => void;
}

export function MenuGroup({ section, onItemPress }: MenuGroupProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} withMargin={false} />
      <View style={styles.card}>
        {section.items.map((item, index) => (
          <MenuRow key={item.id} item={item} onPress={onItemPress} isLast={index === section.items.length - 1} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20, gap: 10 },
  card: {
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: AppColors.divider },
  textWrap: { flex: 1 },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.textPrimary },
  subtitle: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textTertiary,
  },
});

export default MenuGroup;
