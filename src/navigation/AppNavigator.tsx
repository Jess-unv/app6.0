import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import HomeScreen from "../screens/HomeScreen";
import NewsDetail from "../screens/NewsDetail";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Article } from "../api/newsApi";
import { Ionicons } from "@expo/vector-icons";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  HomeDrawer: { role?: string };
  NewsDetail: { article: Article };
  Profile: { role?: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Mapeo de categorías en español
const categoriesMap = {
  general: "General",
  technology: "Tecnología",
  sports: "Deportes",
  health: "Salud",
  business: "Negocios",
  science: "Ciencia",
  entertainment: "Entretenimiento",
};

// Componente DrawerContent mejorado
function CustomDrawerContent(props: any) {
  const { colors, toggleTheme, increaseFont, decreaseFont, theme, fontSize } = useTheme();
  const categories = Object.keys(categoriesMap) as Array<keyof typeof categoriesMap>;

  // Obtener el role de forma segura
  const userRole = props.state?.routes?.[0]?.params?.role || "user";

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      {/* Encabezado del Drawer */}
      <DrawerItem
        label="Mi Perfil"
        icon={({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />}
        labelStyle={{ color: colors.text, fontSize, fontWeight: "bold" }}
        onPress={() => props.navigation.navigate("Profile", { role: userRole })}
      />

      {/* Sección Categorías */}
      <DrawerItem
        label="CATEGORÍAS"
        labelStyle={{ 
          color: colors.primary, 
          fontSize: fontSize - 2, 
          fontWeight: "bold",
          marginTop: 20 
        }}
        onPress={() => {}}
      />
      
      {categories.map((cat) => (
        <DrawerItem
          key={cat}
          label={categoriesMap[cat]}
          labelStyle={{ color: colors.text, fontSize: fontSize - 1, marginLeft: 10 }}
          onPress={() =>
            props.navigation.navigate("Home", { screen: "HomeDrawer", params: { role: cat } })
          }
        />
      ))}

      {/* Sección Configuraciones */}
      <DrawerItem
        label="CONFIGURACIONES"
        labelStyle={{ 
          color: colors.primary, 
          fontSize: fontSize - 2, 
          fontWeight: "bold",
          marginTop: 20 
        }}
        onPress={() => {}}
      />
      
      <DrawerItem
        label={theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
        labelStyle={{ color: colors.text, fontSize: fontSize - 1, marginLeft: 10 }}
        onPress={toggleTheme}
      />
      <DrawerItem 
        label="Aumentar tamaño de letra" 
        labelStyle={{ color: colors.text, fontSize: fontSize - 1, marginLeft: 10 }}
        onPress={increaseFont}
      />
      <DrawerItem 
        label="Disminuir tamaño de letra" 
        labelStyle={{ color: colors.text, fontSize: fontSize - 1, marginLeft: 10 }}
        onPress={decreaseFont}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator({ route }: any) {
  const { colors } = useTheme();
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.accent },
        headerTintColor: "#fff",
      }}
      initialParams={route.params} // Pasar los parámetros al drawer
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeScreen}
        initialParams={route.params} // Pasar parámetros a HomeScreen
        options={{ 
          title: "Noticias",
          drawerIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

function Navigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.accent },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ title: "Detalles" }} />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: "Mi Perfil" }} 
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}