import {
  View,
  Text,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import useCategoryStore from '../zustand/categoryStore';
import COLORS from '../constants/colors';
import CategoryComponent from '../components/CategoryComponent';
import useThemeStore from '../zustand/themeStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NestedListScreen = () => {
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 40;
  const {isDarkMode, toggleTheme} = useThemeStore();
  const colors = COLORS(isDarkMode);
  const {isLoading, message, categories, fetchCategories, fetchJokes} =
    useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectedJoke, setSelectedJoke] = useState<string | null>(null);
  const [categoryJokes, setCategoryJokes] = useState<{[key: string]: Joke[]}>(
    {},
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setCategoryJokes({});
    setRefreshing(false);
  };

  const handleJokePress = (value: string) => {
    setSelectedJoke(value);
  };
  const closeDialog = () => {
    setSelectedJoke(null);
  };

  const handleCategoryPress = async (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
      if (!categoryJokes[category] || categoryJokes[category].length === 0) {
        const newJokes = (await fetchJokes(category)) ?? [];
        setCategoryJokes(prev => ({
          ...prev,
          [category]: newJokes,
        }));
      }
    }
  };

  const handleAddMoreData = async (category: string) => {
    const newJokes = (await fetchJokes(category)) ?? [];
    setCategoryJokes(prev => ({
      ...prev,
      [category]: [...prev[category], ...newJokes],
    }));
  };

  const moveToTop = (index: number) => {
    if (index > 0) {
      const newList = [...categoryList];
      const item = newList.splice(index, 1)[0];
      newList.unshift(item);
      setCategoryList(newList);
    }
  };

  return (
    <View
      style={[
        tw`flex-1`,
        {paddingTop: statusBarHeight, backgroundColor: colors.background},
      ]}>
      <View style={tw`flex-row justify-between items-center px-5`}>
        <Text style={[tw`text-xl font-bold`, {color: colors.text}]}>
          Nested List
        </Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon
            name={isDarkMode ? 'dark-mode' : 'light-mode'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={tw`py-2`} />
      <FlatList
        data={categoryList}
        overScrollMode="never"
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        renderItem={({item, index}) => (
          <CategoryComponent
            message={message}
            item={item}
            index={index}
            expandedCategory={expandedCategory}
            categoryJokes={categoryJokes}
            onExpand={() => handleCategoryPress(item)}
            onAdd={() => handleAddMoreData(item)}
            onTop={() => moveToTop(index)}
            onJokePress={handleJokePress}
          />
        )}
      />
      {selectedJoke && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedJoke}
          onRequestClose={closeDialog}>
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View
              style={[
                tw`p-6 rounded-lg w-4/5`,
                {backgroundColor: colors.background},
              ]}>
              <Text style={[tw`text-base mb-6`, {color: colors.text}]}>
                {selectedJoke}
              </Text>
              <Pressable
                onPress={closeDialog}
                style={[
                  tw`p-3 rounded-lg items-center`,
                  {backgroundColor: colors.primary},
                ]}>
                <Text style={tw`text-white font-medium`}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      {isLoading && (
        <View
          style={[
            tw`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50`,
          ]}>
          <View style={tw`bg-white py-6 px-9 rounded-lg`}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </View>
      )}
    </View>
  );
};

export default NestedListScreen;
