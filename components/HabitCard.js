import { Text, View, StyleSheet, Button, Animated, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av'

// NO TOCAR ESTE ARCHIVO
export default function HabitCard(props) {
  const [count, setCount] = useState(0); // Estado para el contador de hábitos, inicialmente 0
  const swiperef = useRef(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../Assets/sound.mp3')
    );
    await sound.playAsync();
  }

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <Animated.View style={[styles.swipedRow, { opacity }]}>
        <Image style={styles.bin} source={require('../Assets/bin.png')} />
      </Animated.View>
    );
  };

  function handleIncrease() {
    // Añade 1 al contador de hábitos
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 5) {
        playSound(); // sonido al llegar a 5
      }
      return newCount;
    });
  }

  function handleDecrease() {
    // Quita 1 al contador de hábitos
    setCount((prevCount) => prevCount - 1);
  }

  function handleDelete() {
    // Llama a la función onDelete del componente padre con el nombre del hábito
    props.onDelete(props.name);
    swiperef.current.reset();
  }

  function buttonstate() {
    if (count === 0) return true;
    else return false;
  }

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleDelete}
      ref={swiperef}>
      <Card style={styles.habitCard}>
        <View style={styles.row}>
          <Text style={styles.habitName}>{props.name}</Text>
          <View style={styles.counterContainer}>
            <Button
              onPress={handleDecrease}
              disabled={buttonstate()}
              title="-"
            />
            <Text style={styles.counter}>{count}</Text>
            <Button onPress={handleIncrease} title="+" />
          </View>
        </View>
      </Card>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  habitCard: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  counter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  swipedRow: {
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    direction: 'rtl',
    backgroundColor: '#F34235',
  },
  bin: {
    height: 35,
    width: 35,
  },
});
