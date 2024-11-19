import {
  SafeAreaView,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import HabitCard from './components/HabitCard'; // Importa el componente HabitCard
import { useState, useEffect } from 'react';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');

  function ConfirmarNombre() {
    Keyboard.dismiss();
    if (text === '') {
      alert('Debes ingresar un nombre.');
    } else {
      navigation.navigate('Main', { username: text });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={[styles.habitsmanagement, {justifyContent: 'center'}]}>
          <TextInput
            style={[styles.input, { width: '60%', marginHorizontal: 0, textAlign: 'center' }]}
            onChangeText={setText}
            value={text}
            placeholder="¿Cuál es tu nombre?"
            placeholderTextColor="#777c85"
          />
          <View></View>
        </View>
        <View>
          <Button onPress={ConfirmarNombre} title="IR A TUS HABITOS" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function MainScreen({ route }) {
  const [habits, setHabits] = useState([
    <HabitCard name="Ejemplo" onDelete={handleHabitDeletion} />,
  ]);
  const [count, setCount] = useState(0)
  const [habitname, setHabitname] = useState('');
  const [bgColor, setBgColor] = useState('#ecf0f1'); // Estado para el color de fondo
  const { username } = route.params;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1);
    return () => clearInterval(interval);
  }, []);

  function handleHabitDeletion(habit) {
    const nhabits = habits.map((i) => i.props.name);
    const index = nhabits.indexOf(habit);
    habits.splice(index, 1);
    setHabits(habits);
  }

  function handlePress() {
    Keyboard.dismiss();
    const nhabits = habits.map((i) => i.props.name);
    if (nhabits.includes(habitname)) {
      alert('Ya has ingresado ese hábito.');
    } else if (habitname === '') {
      alert('Debes ingresar un nombre para tu hábito.');
    } else {
      habits.push(
        <HabitCard name={habitname} onDelete={handleHabitDeletion} />
      );
      setHabits(habits);
    }
  }

  // Función para alternar entre modo oscuro y claro
  function toggleTheme() {
    setBgColor(bgColor === '#ecf0f1' ? 'darkgray' : '#ecf0f1');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.countertext}>Bienvenido {username}</Text>
      <View style={styles.habitsmanagement}>
        <TextInput
          style={styles.input}
          onChangeText={setHabitname}
          value={habitname}
          placeholder="Ej: Estudiar"
          placeholderTextColor="#777c85"
        />
        <View>
          <Button onPress={handlePress} title="AGREGAR" />
        </View>
      </View>
      <ScrollView style={styles.habits}>{habits}</ScrollView>
      {/* Botón para cambiar entre modo oscuro y claro */}
      <View>
        <Button onPress={toggleTheme} title="CAMBIAR MODO CLARO / OSCURO" />
      </View>
    </SafeAreaView>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerStyle: { backgroundColor: 'lightblue' },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Inicio',
        textAlign: 'center',
        alignItems: 'center',
      },
    },
    Main: MainScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  habitsmanagement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countertext: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d5dbe3',
  },
  habits: {
    marginHorizontal: 10,
  },
});
