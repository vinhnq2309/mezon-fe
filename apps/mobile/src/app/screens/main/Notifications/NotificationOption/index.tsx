import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@mezon/mobile-ui'
import { styles as s } from './NotificationOption.styles'
import { EActionDataNotify } from '../types'
import { MuteIcon, SettingIcon, } from "@mezon/mobile-components";
import MezonRadioButton from '../../../../temp-ui/MezonRadioButton'


const NotificationOption = ({onChange}) => {
  const tabDataNotify = [
    {id: 1, title: 'For you', value: 'individual', icon: <Text style={s.icon}>@</Text>  },
    {id: 2, title: 'Mention', value: 'mention', icon: <MuteIcon width={22} height={22} />  },
  ];
  const [selectedTabs, setSelectedTabs] = useState({ individual: true, mention: true });

  const handleTabChange = (value, isSelected) => {
    setSelectedTabs(prevState => ({
      ...prevState,
      [value]: isSelected
    }));
  };


  const calculateValue = () => {
    return selectedTabs.individual && selectedTabs.mention
      ? EActionDataNotify.All
      : selectedTabs.individual
      ? EActionDataNotify.Individual
      : selectedTabs.mention
      ? EActionDataNotify.Mention
      : null;
  };


  useEffect(() => {
    const value = calculateValue();
    onChange(value);
  }, [selectedTabs]);

    return (
        <View style={s.wrapperOption}>
            <Text style={s.headerTitle}>Notifications</Text>
            <View style={s.optionContainer}>{
              tabDataNotify.map((option)=>(
                <View key={option.id} style={s.option}>
                  {option.icon}
                  <Text style={s.textOption}>{option.title}</Text>
                  <MezonRadioButton onChange={(isSelected) => handleTabChange(option.value, isSelected)}
                  height={30} width={60}
                  toggleOnColor={Colors.white}
                  value={true}
                  toggleBgOffColor={Colors.gray48}
                  toggleBgOnColor={Colors.bgButton}
                  toggleOffColor={Colors.gray72}>
                  </MezonRadioButton>
                </View>
              ))
            }
            </View>
            <View style={s.notifySetting}>
            <View style={s.option}>
                  <SettingIcon width={22} height={22} />
                  <Text style={s.textOption}>Notification Settings</Text>
                </View>
            </View>
        </View >
    )
}

export default NotificationOption

