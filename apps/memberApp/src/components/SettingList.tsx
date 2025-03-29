import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, TextStyle} from '../themes';

export type SettingListProps = {
  title?: string;
  items?: {
    title: string;
    icon?: string;
    onPress?: () => void;
  }[];
  iconSize?: number;
  iconColor?: string;
};

const SettingList = ({
  title = 'Title',
  items = [],
  iconSize = 24,
  iconColor = 'black',
}: SettingListProps) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text
        style={[
          TextStyle.P2B,
          {color: Colors.black, fontSize: 20, marginBottom: 10},
        ]}>
        {title.toUpperCase()}
      </Text>

      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const itemStyle = [
          styles.listContainer,
          isFirst && styles.firstItem,
          isLast && styles.lastItem,
          !isFirst && !isLast && styles.middleItem,
        ];

        return (
          <View key={index} style={itemStyle}>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={item.onPress}>
              <Icon
                name={item.icon || 'help-circle-outline'}
                size={iconSize}
                color={iconColor}
              />

              <View style={styles.leftContent}>
                <View style={styles.textIconContainer}>
                  <Text
                    style={[
                      TextStyle.P2B,
                      {fontSize: 20, color: Colors.black, marginHorizontal: 20},
                    ]}>
                    {item.title}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={25} color={Colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listContainer: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  firstItem: {
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightGreen,
  },
  lastItem: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  middleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightGreen,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textIconContainer: {justifyContent: 'space-between', width: '85%'},
});
export default SettingList;
