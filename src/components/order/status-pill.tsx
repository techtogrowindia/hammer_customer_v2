import { Text, View } from 'react-native';
import { STATUS_META } from './constants';
// From ./types, which is the vocabulary STATUS_META is keyed by (quoted,
// confirmed, on_hold, …). order-card never exported an OrderStatus at all.
import { OrderStatus } from './types';
import { styles } from './styles';

export function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
      <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}
