import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type LoginNavProp = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: { navigation: LoginNavProp }) {
  const { colors } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLogin]);

  // FUNCIÓN CORREGIDA - Ahora se llama handleAuth y maneja ambos casos
  const handleAuth = () => {
    if (isLogin) {
      // Modo Login
      if ((email === "admin" || username === "admin") && password === "1234") {
        navigation.replace("Home", { screen: "HomeDrawer", params: { role: "admin" } });
      } else if ((email === "user" || username === "user") && password === "1234") {
        navigation.replace("Home", { screen: "HomeDrawer", params: { role: "user" } });
      } else {
        Alert.alert("Error", "Credenciales inválidas. Usa: admin/user y 1234");
      }
    } else {
      // Modo Registro
      handleRegister();
    }
  };

  // Función separada para registro
  const handleRegister = () => {
    if (!email || !username || !password || !name) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (password.length < 4) {
      Alert.alert("Error", "La contraseña debe tener al menos 4 caracteres");
      return;
    }
    // Aquí normalmente enviarías los datos al backend
    Alert.alert("Éxito", "Cuenta creada correctamente", [
      { text: "OK", onPress: () => {
        setIsLogin(true);
        // Limpiar campos después del registro
        setEmail("");
        setUsername("");
        setPassword("");
        setName("");
        setConfirmPassword("");
      }}
    ]);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setUsername("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperar Contraseña",
      "Ingresa tu correo electrónico para recuperar tu contraseña:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () => Alert.alert("Éxito", "Se ha enviado un enlace de recuperación a tu correo")
        }
      ]
    );
  };

  // Modal de Términos y Condiciones
  const TermsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={termsModalVisible}
      onRequestClose={() => setTermsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Términos y Condiciones</Text>
            <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
              Términos de Uso
            </Text>
            
            <Text style={[styles.modalText, { color: colors.text }]}>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              1. Aceptación de los Términos
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Al utilizar esta aplicación, aceptas cumplir con estos términos y condiciones. Es una aplicación educativa desarrollada para fines de aprendizaje.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              2. Uso de la Aplicación
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              • Proporciona acceso a noticias de diversas fuentes mediante APIs públicas.{'\n'}
              • El contenido mostrado es obtenido de fuentes externas.{'\n'}
              • Debes usar la aplicación de manera responsable y legal.{'\n'}
              • No puedes utilizar la aplicación para actividades ilegales.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              3. Cuentas de Usuario
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              • Las cuentas son locales y no requieren registro en servidores externos.{'\n'}
              • Eres responsable de mantener la confidencialidad de tus credenciales.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              4. Limitación de Responsabilidad
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Esta es una aplicación educativa y no garantiza la disponibilidad continua del servicio. El contenido de noticias es proporcionado "tal cual" sin garantías de precisión.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              5. Modificaciones
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.
            </Text>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.accent }]}
              onPress={() => setTermsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar y Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Modal de Política de Privacidad
  const PrivacyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={privacyModalVisible}
      onRequestClose={() => setPrivacyModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Política de Privacidad</Text>
            <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
              Política de Privacidad
            </Text>
            
            <Text style={[styles.modalText, { color: colors.text }]}>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              1. Información que Recopilamos
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Esta es una aplicación educativa que opera localmente en tu dispositivo. Toda la información se almacena localmente y no se transmite a servidores externos.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              2. Datos Almacenados Localmente
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              • Credenciales de inicio de sesión (almacenadas localmente){'\n'}
              • Preferencias de la aplicación{'\n'}
              • Historial de noticias vistas{'\n'}
              • Configuraciones personalizadas
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              3. Uso de la Información
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Utilizamos la información almacenada localmente para:{'\n'}
              • Personalizar tu experiencia en la app{'\n'}
              • Mantener tus preferencias de configuración{'\n'}
              • Mejorar el funcionamiento de la aplicación
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              4. Compartir Información
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              No compartimos tu información personal con terceros. La aplicación funciona completamente de manera local en tu dispositivo.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              5. Seguridad
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Implementamos medidas de seguridad para proteger tu información local. Sin embargo, recuerda que ningún sistema es completamente seguro.
            </Text>

            <Text style={[styles.modalSection, { color: colors.text }]}>
              6. Tus Derechos
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Tienes derecho a:{'\n'}
              • Acceder a tus datos locales{'\n'}
              • Corregir información incorrecta{'\n'}
              • Eliminar tu cuenta y datos locales{'\n'}
              • Exportar tus datos
            </Text>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.accent }]}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          {/* Logo desde assets */}
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.subtitle, { color: colors.text + "99" }]}>
            {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </Text>

        {!isLogin && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Nombre completo"
            placeholderTextColor={colors.text + "99"}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder={isLogin ? "Usuario o correo electrónico" : "Correo electrónico"}
          placeholderTextColor={colors.text + "99"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        {!isLogin && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Nombre de usuario"
            placeholderTextColor={colors.text + "99"}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username"
          />
        )}

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Contraseña"
          placeholderTextColor={colors.text + "99"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="password"
        />

        {!isLogin && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Confirmar contraseña"
            placeholderTextColor={colors.text + "99"}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="password"
          />
        )}

        {isLogin && (
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.text + "99" }]}>o</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
          <Text style={[styles.toggleText, { color: colors.text }]}>
            {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text + "99" }]}>
            Al {isLogin ? "iniciar sesión" : "registrarte"}, aceptas nuestros{'\n'}
            <Text 
              style={{ color: colors.primary }} 
              onPress={() => setTermsModalVisible(true)}
            >
              Términos y Condiciones
            </Text> y{' '}
            <Text 
              style={{ color: colors.primary }}
              onPress={() => setPrivacyModalVisible(true)}
            >
              Política de Privacidad
            </Text>
          </Text>
        </View>
      </Animated.View>

      {/* Modales */}
      <TermsModal />
      <PrivacyModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  toggleButton: {
    marginTop: 10,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  // Estilos para modales
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSection: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});