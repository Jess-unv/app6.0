import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { getTopHeadlines, searchNews, Article } from "../api/newsApi";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import NewsCard from "../components/NewsCard";
import { RouteProp } from "@react-navigation/native";

type HomeNavProp = StackNavigationProp<RootStackParamList, "HomeDrawer">;
type HomeRouteProp = RouteProp<RootStackParamList, "HomeDrawer">;

export default function HomeScreen({
  navigation,
  route,
}: {
  navigation: HomeNavProp;
  route: HomeRouteProp;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { colors, fontSize } = useTheme();

  const selectedCategory = route?.params?.role || "general";

  useEffect(() => {
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const loadNews = async (category: string = "general") => {
    setLoading(true);
    const news = await getTopHeadlines(category);
    setArticles(news);
    setFilteredArticles(news);
    setLoading(false);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredArticles(articles);
      return;
    }
    const apiResults = await searchNews(text);
    setFilteredArticles(apiResults);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra de búsqueda */}
     <TextInput
  style={[
    styles.searchInput,
    { backgroundColor: colors.card, color: colors.text, fontSize },
  ]}
       placeholder="Buscar noticias..."
       placeholderTextColor={colors.text + "99"}
       value={searchQuery}
       onChangeText={handleSearch}
       />

      <FlatList
        data={filteredArticles}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={() => navigation.navigate("NewsDetail", { article: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: { borderRadius: 8, padding: 10, marginBottom: 15 },
});
