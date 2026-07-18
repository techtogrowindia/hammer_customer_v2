import { Text, View } from 'react-native';
import { STATUS_META } from './constants';
import { OrderStatus } from './order-card';
import { styles } from './styles';

export function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
      <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}
