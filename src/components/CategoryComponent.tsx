import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useThemeStore from '../zustand/themeStore';

type Props = {
  message: string | null;
  item: string;
  index: number;
  expandedCategory: string | null;
  categoryJokes: {[key: string]: Joke[]};
  onExpand: (category: string) => void;
  onAdd: (category: string) => void;
  onTop: (index: number) => void;
  onJokePress: (joke: string) => void;
};

const CategoryComponent = (props: Props) => {
  const {isDarkMode, toggleTheme} = useThemeStore();
  const colors = COLORS(isDarkMode);

  return (
    <View style={tw`mb-6`}>
      <TouchableOpacity
        style={[
          tw`flex-row justify-between items-center p-4 rounded-lg mx-5`,
          {backgroundColor: colors.secondary},
        ]}
        onPress={() => props.onExpand(props.item)}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-base font-semibold mr-2`}>
            {props.index + 1}.
          </Text>
          <Text style={tw`text-base font-semibold`}>{props.item}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => props.onTop(props.index)}
            disabled={props.index === 0}
            style={[
              tw`p-2 rounded-lg mr-8 w-20 items-center justify-center`,
              {
                backgroundColor:
                  props.index === 0 ? colors.success : colors.error,
              },
            ]}>
            <Text style={tw`text-black font-medium`}>
              {props.index === 0 ? 'Top' : 'Go Top'}
            </Text>
          </TouchableOpacity>
          <Icon
            name={
              props.expandedCategory === props.item
                ? 'keyboard-arrow-up'
                : 'keyboard-arrow-down'
            }
            size={24}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>
      {props.expandedCategory === props.item && (
        <View style={tw`p-3 bg-gray-100 rounded-lg mt-2 mx-5`}>
          {props.categoryJokes[props.item]?.length > 0 && (
            <>
              {props.categoryJokes[props.item].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => props.onJokePress(item.joke)}>
                  <Text key={index} style={tw`text-sm mb-2`}>
                    - {item.joke}
                  </Text>
                </TouchableOpacity>
              ))}
              {props.categoryJokes[props.item].length < 6 && (
                <TouchableOpacity
                  onPress={() => props.onAdd(props.item)}
                  style={[
                    tw`p-2 rounded-lg mt-2 items-center justify-center`,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text style={tw`text-white font-medium`}>Add More Data</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {props.categoryJokes[props.item]?.length === 0 &&
            props.message == null && (
              <Text style={tw`text-sm italic text-gray-600 text-center`}>
                No Jokes Available
              </Text>
            )}
          {props.message !== null && (
            <Text style={tw`text-sm italic text-gray-600 text-center`}>
              {props.message}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default CategoryComponent;
