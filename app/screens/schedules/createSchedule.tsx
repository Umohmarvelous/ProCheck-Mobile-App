// screens/CreateScheduleScreen.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import { useSchedules } from '../../../context/ScheduleContext';
import { Schedule, ScheduleTag, ScheduleLocationType } from '../../../types/schedule';
import { Ionicons } from '@expo/vector-icons';
import theme, { GlassTheme } from '@/constants/theme';
import { Link } from 'expo-router';
// import { v4 as uuidv4 } from 'uuid'; // or any ID generator

const COLORS = {
  bg: '#202e32',
  accent1: '#85937a',
  accent2: '#586c5c',
  accent3: '#a9af90',
  accent4: '#dfdcb9',
  textLight: '#f7f7f7',
};

const TAGS: ScheduleTag[] = ['meeting', 'event', 'holiday'];

const COLOR_OPTIONS = ['#d80505ff', '#51e36eff', '#475af1ff', '#f267d4ff', '#eee718ff', '#28e0f0ff', '#686367ff'];

const CreateScheduleScreen: React.FC = () => {
  const theme = GlassTheme.dark;
  
  const { addSchedule } = useSchedules();
  const [name, setName] = useState('');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000));
  const [tag, setTag] = useState<ScheduleTag>('meeting');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [locationType, setLocationType] =
    useState<ScheduleLocationType>('online');
  const [locationLabel, setLocationLabel] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = useMemo(
    () => !!name.trim() && start < end,
    [name, start, end]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      Alert.alert('Invalid', 'Please enter a name and valid time range.');
      return;
    }
    const schedule: Schedule = {
      // id: uuidv4(),
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      start,
      end,
      tag,
      color,
      locationType,
      locationLabel: locationLabel.trim(),
      locationUrl: locationType === 'online' ? locationUrl.trim() : undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date(),
    };
    addSchedule(schedule);
    Alert.alert('Saved', 'Schedule created.');
    // navigate back in your router
  }, [
    addSchedule,
    canSubmit,
    color,
    end,
    locationLabel,
    locationType,
    locationUrl,
    name,
    notes,
    start,
    tag,
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.headerRow}>
        <Link href='/screens/schedules/ScheduleLayout'  dismissTo >
          <Ionicons name='chevron-back' size={30} color={theme.checkerText} />
        </Link>
        <Text style={[styles.headerTitle, styles.label]}>Schedule</Text>
      

        <Link href="/Home"  dismissTo >
        {/* <Button title="Push Button" /> */}
          <Ionicons name="close" size={30} color="white" />
        </Link>
      </View>
      
      

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Meeting with James Brown"
        placeholderTextColor="#aaa"
        style={[styles.input, ]}
      />

      {/* Time pickers: wire to your time picker library */}
      <View>

      </View>
      <View style={styles.row}>

        <View>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity style={[styles.timeButton, styles.input, ]}>
            <Text style={styles.timeText}>
              {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity style={[styles.timeButton, styles.input, ]}>
            <Text style={styles.timeText}>
              {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location type */}
      <Text style={[styles.label, { marginTop: 50 }]}>Where will it be held ?</Text>
      <View style={[styles.row, styles.chipContent]}>
        {(['online', 'offline'] as ScheduleLocationType[]).map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.chip,
              locationType === option && styles.chipActive,
            ]}
            onPress={() => setLocationType(option)}
          >
            <Text
              style={[
                styles.chipText,
                locationType === option && styles.chipTextActive,
              ]}
            >
              {option.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <View style={styles.row}>



        <View style={{  height: 'auto', marginRight: 0, flexDirection: 'row', }}>
        {locationType === 'offline' && (
          <>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.label}>
                Location
              </Text>
              <View style={[{  height: 'auto', marginRight: 12, flexDirection: 'row' }, styles.input]}>
                  <Ionicons name='location' size={30} color = { theme.checkerSuccess } />
              </View> 
            </View>

            {/* <View style={{ flexDirection: 'row', }}>   */}
            <TextInput
              value={locationLabel}
              onChangeText={setLocationLabel}
              placeholder='Type your location...'
              placeholderTextColor="#aaa"
              style={[styles.input, {paddingVertical: 0,  flex: 1, alignSelf: 'flex-end', height: 70 } ]}
              />
            {/* </View> */}
          </>
        )}
        </View>


        <View style={{ flex: 1, }}>
          {locationType === 'online' && (
            <View style={{ flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={[{flexDirection: 'column', width: 'auto'} ]}>
                <Text style={styles.label}>
                  Platform
                </Text>
                <View style={[{ marginRight: 12, flexDirection: 'row' }, styles.input]}>
                  <Text style={{color: '#fff'}}>{locationType === 'online' ? 'Google Meet' : ''}</Text>
                </View> 
              </View>

              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <Text style={styles.label}>Meeting link</Text>
                <TextInput
                  value={locationUrl}
                  onChangeText={setLocationUrl}
                  placeholder="https://"
                  placeholderTextColor="#aaa"
                  style={[styles.input, { width: 'auto' }]}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}
        </View>
      </View>





      {/* Tag dropdown / radio */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Section</Text>
        <View style={[styles.row]}>
          {TAGS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, tag === t && styles.chipActive, {paddingVertical: 19, paddingHorizontal: 34}]}
              onPress={() => setTag(t)}
            >
              <Text
                style={[
                  styles.chipText,
                  tag === t && styles.chipTextActive,
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color tag */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Tag</Text>
        <View style={styles.row}>
          {COLOR_OPTIONS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorCircle,
                { backgroundColor: c },
                color === c && styles.colorCircleActive,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.label, { marginTop: 52 }]}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Add description"
        placeholderTextColor="#aaa"
        style={[styles.input, styles.notesInput]}
        multiline
      />

      <TouchableOpacity
        style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.submitText}>Save schedule</Text>
      </TouchableOpacity>

  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.dark.checkerSurface 
    
  },
  content: { 
    padding: 16,
    paddingHorizontal: 15, 
    paddingBottom: 40 
    
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    color: COLORS.textLight,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerTitle: {
    color: theme.dark.checkerTextSecondary,  
  },

  // label: {
  //   fontSize: 20,
  //   fontWeight: '600',
  //   color: theme.dark.checkerTextSecondary,
    
  //   },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.dark.checkerTextSecondary,
    marginTop: 32,
    marginBottom: 13,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 20,
    color: theme.dark.checkerText,
    backgroundColor: theme.dark.glassOverlay,
  },
  notesInput: { 
    minHeight: 150, 
    textAlignVertical: 'top' 
  },
  col: { 
    flexDirection: 'column', 
    alignItems: 'flex-start' , 
    marginTop: 8 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: 8 ,
    // borderWidth: 4,
    // borderColor: 'red',
    width: 'auto',
  },

  chipContent:{
    backgroundColor: theme.dark.glassOverlay,
    padding: 14,
    borderRadius: theme.radius.large,
    // marginHorizontal: 80,
    width: 175,
    justifyContent: 'flex-start',

  },
  timeButton: {
    width: 160,

  },
  timeText: { 
    color: COLORS.textLight, 
    fontWeight: '600' 
    
  },
  toText: { 
    marginHorizontal: 8, 
    color: COLORS.textLight,
    marginVertical: 15,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radius.medium,
    // backgroundColor: theme.dark.checkerBorder,
    marginRight: 8,
  },
  chipActive: { 
    backgroundColor: theme.dark.checkerSuccess ,
    borderRadius: theme.radius.medium,
  },
  chipText: { 
    color: COLORS.textLight, 
    fontSize: 12 
  },
  chipTextActive: { 
    color: COLORS.bg, 
    fontWeight: '700' 
  },
  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
    opacity: 0.7,
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: COLORS.textLight,
    opacity: 1,
  },
  submitButton: {
    marginTop: 28,
    backgroundColor: theme.dark.checkerSuccess,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    color: theme.dark.textTertiary,

  },
  submitDisabled: { 
    opacity: 0.5,  
    backgroundColor: theme.dark.checkerTextSecondary, 
    color: theme.dark.textSecondary,
  },
  submitText: {
    color: theme.dark.textTertiary,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CreateScheduleScreen;