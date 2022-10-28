import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  option: {
    fontSize: 20,
    textAlign: 'center',
  },
  unselected: {
    color:'#000000',
    backgroundColor: 'white',
    borderWidth: 1,
    margin: 5,
    borderRadius: 10,
  },
  selected: {
    color:'#FFF',
    backgroundColor: 'red',
    margin: 5,
    borderRadius: 10,
  },
});
export default styles;