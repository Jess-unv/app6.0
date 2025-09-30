import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  Linking,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type ProfileNavProp = StackNavigationProp<RootStackParamList, "Profile">;

// Interface para configuración local
interface AppSettings {
  autoPlayVideos: boolean;
  dataSaver: boolean;
  fontSize: number;
  language: string;
  downloadImages: boolean;
}

export default function ProfileScreen({ navigation, route }: { navigation: ProfileNavProp; route?: any }) {
  const { colors, fontSize, theme, toggleTheme } = useTheme();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    autoPlayVideos: false,
    dataSaver: false,
    fontSize: 16,
    language: "es",
    downloadImages: true,
  });
  
  // Manejar caso donde route podría ser undefined
  const userRole = route?.params?.role || "user";

  const userInfo = {
    name: userRole === "admin" ? "Administrador" : "Usuario",
    email: userRole === "admin" ? "admin@example.com" : "usuario@example.com",
    username: userRole === "admin" ? "admin" : "usuario123",
    role: userRole === "admin" ? "Administrador" : "Usuario estándar",
    joinDate: "15 de Enero, 2024",
  };

  // FUNCIÓN DE CERRAR SESIÓN MEJORADA - lleva al Login
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: () => {
            // Navegar al Login y resetear la navegación
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  // Funciones para configuración
  const toggleSetting = (setting: keyof AppSettings) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      "Limpiar Cache",
      "¿Estás seguro de que quieres limpiar el caché de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpiar", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Éxito", "Cache limpiado correctamente");
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Exportar Datos",
      "Se generará un archivo con tus datos locales",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Exportar", 
          onPress: () => {
            Alert.alert("Éxito", "Datos exportados correctamente");
          }
        },
      ]
    );
  };

  // Funciones de Ayuda y Soporte
  const handleContactSupport = () => {
    Alert.alert(
      "Contactar Soporte",
      "¿Cómo prefieres contactarnos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "📧 Email", 
          onPress: () => {
            Linking.openURL('mailto:soporte@newsapp.edu?subject=Soporte NewsApp&body=Hola, necesito ayuda con...');
          }
        },
        { 
          text: "📞 Llamar", 
          onPress: () => {
            Linking.openURL('tel:+1234567890');
          }
        },
      ]
    );
  };

  const handleViewTutorial = () => {
    Alert.alert(
      "Tutorial de la App",
      "¿Te gustaría ver un tutorial sobre cómo usar NewsApp?",
      [
        { text: "Ahora no", style: "cancel" },
        { 
          text: "Ver Tutorial", 
          onPress: () => {
            Alert.alert(
              "Tutorial NewsApp",
              "📱 Cómo usar NewsApp:\n\n" +
              "• 📰 Desliza hacia abajo para recargar noticias\n" +
              "• 🔍 Usa la barra de búsqueda para encontrar temas específicos\n" +
              "• 📂 Cambia categorías desde el menú lateral\n" +
              "• 🌙 Activa el modo oscuro en Configuración\n" +
              "• 💾 Guarda noticias para leer offline\n\n" +
              "¡Explora todas las funciones!"
            );
          }
        },
      ]
    );
  };

  const handleReportProblem = () => {
    Alert.alert(
      "Reportar Problema",
      "Describe el problema que encontraste:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Problema de carga", 
          onPress: () => {
            Alert.alert("Reporte Enviado", "Hemos registrado el problema de carga. Gracias por tu reporte.");
          }
        },
        { 
          text: "Error en la app", 
          onPress: () => {
            Alert.alert("Reporte Enviado", "Hemos registrado el error. Lo revisaremos pronto.");
          }
        },
        { 
          text: "Otra cosa", 
          onPress: () => {
            Alert.alert("Soporte Contactado", "Por favor describe tu problema en el email de soporte.");
            Linking.openURL('mailto:soporte@newsapp.edu?subject=Problema en NewsApp&body=Descripción del problema:');
          }
        },
      ]
    );
  };

  const handleViewFAQ = () => {
    Alert.alert(
      "Preguntas Frecuentes",
      "❓ ¿Cómo cambio de categoría?\n" +
      "→ Usa el menú lateral y selecciona una categoría\n\n" +
      "❓ ¿Cómo busco noticias?\n" +
      "→ Usa la barra de búsqueda en la pantalla principal\n\n" +
      "❓ ¿La app funciona offline?\n" +
      "→ Sí, puedes leer noticias previamente cargadas\n\n" +
      "❓ ¿Cómo cambio el tema oscuro/claro?\n" +
      "→ Ve a Configuración → Modo oscuro\n\n" +
      "¿Necesitas más ayuda? Contacta a soporte.",
      [
        { text: "Cerrar", style: "default" },
        { 
          text: "Contactar Soporte", 
          onPress: handleContactSupport
        },
      ]
    );
  };

  const SettingItem = ({ 
    label, 
    value, 
    onToggle,
    type = 'switch'
  }: { 
    label: string; 
    value: boolean; 
    onToggle: () => void;
    type?: 'switch' | 'info';
  }) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <Text style={[styles.settingLabel, { color: colors.text, fontSize }]}>{label}</Text>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <Text style={[styles.settingValue, { color: colors.text + '99' }]}>
          {value ? 'Activado' : 'Desactivado'}
        </Text>
      )}
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.text, fontSize }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text, fontSize: fontSize - 1 }]}>{value}</Text>
    </View>
  );

  // Modal de Configuración
  const SettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={settingsModalVisible}
      onRequestClose={() => setSettingsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Configuración</Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.settingsList}>
            <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>
              Preferencias de Noticias
            </Text>
            
            <SettingItem
              label="Reproducción automática de videos"
              value={appSettings.autoPlayVideos}
              onToggle={() => toggleSetting('autoPlayVideos')}
            />
            
            <SettingItem
              label="Modo ahorro de datos"
              value={appSettings.dataSaver}
              onToggle={() => toggleSetting('dataSaver')}
            />
            
            <SettingItem
              label="Descargar imágenes automáticamente"
              value={appSettings.downloadImages}
              onToggle={() => toggleSetting('downloadImages')}
            />

            <Text style={[styles.settingsSectionTitle, { color: colors.text, marginTop: 20 }]}>
              Apariencia
            </Text>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text, fontSize }]}>
                Modo oscuro
              </Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={theme === 'dark' ? "#fff" : "#f4f3f4"}
              />
            </View>

            <Text style={[styles.settingsSectionTitle, { color: colors.text, marginTop: 20 }]}>
              Gestión de Datos
            </Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, { borderBottomColor: colors.border }]}
              onPress={handleClearCache}
            >
              <Ionicons name="trash-outline" size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text, fontSize }]}>
                Limpiar cache
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { borderBottomColor: colors.border }]}
              onPress={handleExportData}
            >
              <Ionicons name="download-outline" size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text, fontSize }]}>
                Exportar mis datos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSettingsModalVisible(false);
                Alert.alert("Información", "Versión 1.0.0\nNewsApp Educativo");
              }}
            >
              <Ionicons name="information-circle-outline" size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text, fontSize }]}>
                Acerca de la app
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Modal de Ayuda y Soporte
  const HelpModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={helpModalVisible}
      onRequestClose={() => setHelpModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Ayuda y Soporte</Text>
            <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.settingsList}>
            <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>
              Centro de Ayuda
            </Text>
            
            <TouchableOpacity 
              style={[styles.helpButton, { borderBottomColor: colors.border }]}
              onPress={handleViewTutorial}
            >
              <Ionicons name="play-circle-outline" size={22} color={colors.primary} />
              <View style={styles.helpButtonContent}>
                <Text style={[styles.helpButtonTitle, { color: colors.text }]}>
                  Ver Tutorial
                </Text>
                <Text style={[styles.helpButtonDescription, { color: colors.text + '99' }]}>
                  Aprende a usar todas las funciones
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.helpButton, { borderBottomColor: colors.border }]}
              onPress={handleViewFAQ}
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
              <View style={styles.helpButtonContent}>
                <Text style={[styles.helpButtonTitle, { color: colors.text }]}>
                  Preguntas Frecuentes
                </Text>
                <Text style={[styles.helpButtonDescription, { color: colors.text + '99' }]}>
                  Respuestas a dudas comunes
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.helpButton, { borderBottomColor: colors.border }]}
              onPress={handleReportProblem}
            >
              <Ionicons name="warning-outline" size={22} color={colors.primary} />
              <View style={styles.helpButtonContent}>
                <Text style={[styles.helpButtonTitle, { color: colors.text }]}>
                  Reportar Problema
                </Text>
                <Text style={[styles.helpButtonDescription, { color: colors.text + '99' }]}>
                  Informar errores o fallos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.helpButton, { borderBottomColor: colors.border }]}
              onPress={handleContactSupport}
            >
              <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
              <View style={styles.helpButtonContent}>
                <Text style={[styles.helpButtonTitle, { color: colors.text }]}>
                  Contactar Soporte
                </Text>
                <Text style={[styles.helpButtonDescription, { color: colors.text + '99' }]}>
                  Habla directamente con nuestro equipo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => {
                setHelpModalVisible(false);
                Alert.alert(
                  "Información de la App",
                  "📱 NewsApp - Proyecto Educativo\n\n" +
                  "Versión: 1.0.0\n" +
                  "Desarrollado para fines educativos\n" +
                  "Tecnologías: React Native, TypeScript\n\n" +
                  "© 2024 NewsApp Educativo"
                );
              }}
            >
              <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
              <View style={styles.helpButtonContent}>
                <Text style={[styles.helpButtonTitle, { color: colors.text }]}>
                  Acerca de NewsApp
                </Text>
                <Text style={[styles.helpButtonDescription, { color: colors.text + '99' }]}>
                  Información de la aplicación
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
            </TouchableOpacity>

            <View style={styles.helpFooter}>
              <Text style={[styles.helpFooterText, { color: colors.text + '99' }]}>
                ¿No encuentras lo que buscas?{'\n'}
                Contacta a nuestro equipo de soporte.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{userInfo.name}</Text>
        <Text style={[styles.userRole, { color: colors.accent }]}>{userInfo.role}</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Personal</Text>
        
        <InfoRow label="Nombre completo" value={userInfo.name} />
        <InfoRow label="Correo electrónico" value={userInfo.email} />
        <InfoRow label="Nombre de usuario" value={userInfo.username} />
        <InfoRow label="Tipo de cuenta" value={userInfo.role} />
        <InfoRow label="Miembro desde" value={userInfo.joinDate} />
      </View>

      <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones</Text>
        
        <TouchableOpacity 
          style={[styles.actionButton, { borderBottomColor: colors.border }]}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={20} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text, fontSize }]}>Configuración</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setHelpModalVisible(true)}
        >
          <Ionicons name="help-circle-outline" size={20} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text, fontSize }]}>Ayuda y Soporte</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text + "99"} />
        </TouchableOpacity>
      </View>

      {/* BOTÓN DE CERRAR SESIÓN MEJORADO */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.card }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#dc3545" />
        <Text style={[styles.logoutText, { fontSize }]}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modales */}
      <SettingsModal />
      <HelpModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoCard: {
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionsCard: {
    margin: 15,
    borderRadius: 12,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontWeight: "500",
  },
  value: {
    fontWeight: "400",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  actionText: {
    marginLeft: 12,
    fontWeight: "500",
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: "#dc3545",
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Estilos para los modales
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "80%",
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
  settingsList: {
    paddingHorizontal: 20,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontWeight: "500",
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
  },
  // Estilos específicos para ayuda
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  helpButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpButtonTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  helpButtonDescription: {
    fontSize: 14,
  },
  helpFooter: {
    marginTop: 25,
    padding: 16,
    alignItems: "center",
  },
  helpFooterText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});