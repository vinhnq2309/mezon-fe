import { Colors, size } from '@mezon/mobile-ui';
import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  wrapperItem: {
    flexDirection: 'row',
    borderBottomColor: Colors.gray48,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: size.label,
    fontWeight: '600',
    color: Colors.white
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50
  },
  symbol: {
    fontSize: size.label,
    fontWeight: '600',
    color: Colors.gray48
  },
  subText:{
    fontSize: size.medium,
    fontWeight: '500',
    color: Colors.gray72
  }
})
