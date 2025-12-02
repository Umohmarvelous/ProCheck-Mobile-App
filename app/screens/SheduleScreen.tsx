import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, LinkTrigger, LinkMenu, LinkMenuAction } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const colors = ['#202e32', '#85937a', '#586c5c', '#a9af90', '#dfdcb9'];

interface Schedule {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  locationType: 'online' | 'offline';
  link?: string;
  tag: 'meeting' | 'event' | 'holiday';
  color: string;
  isExpanded: boolean;
}

const ScheduleScreen = () => {
  // State management with useMemo/useCallback for performance
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'meetings' | 'events' | 'holidays'>('meetings');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'tag' | 'color'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Form state for create modal
  const [formData, setFormData] = useState({
    name: '',
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    locationType: 'online',
    link: '',
    tag: 'meeting' as Schedule['tag'],
    color: colors[0],
  });

  // Refs for performance
  const flatListRef = useRef<FlatList>(null);

  // Update current date daily
  useEffect(() => {
    const updateDate = () => setSelectedDate(new Date());
    const interval = setInterval(updateDate, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoized filtered and sorted schedules
  const filteredSchedules = useMemo(() => {
    const now = new Date();
    return schedules
      .filter(schedule => {
        const isSameDate = 
          schedule.startTime.toDateString() === selectedDate.toDateString();
        const matchesSearch = schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          schedule.tag.toLowerCase().includes(searchQuery.toLowerCase());
        return isSameDate && matchesSearch;
      })
      .map(schedule => ({
        ...schedule,
        isPast: schedule.endTime < now,
      }))
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'date':
            return a.startTime.getTime() - b.startTime.getTime();
          case 'tag':
            return a.tag.localeCompare(b.tag);
          default:
            return 0;
        }
      });
  }, [schedules, selectedDate, searchQuery, sortBy]);

  const tabSchedules = useMemo(() => {
    return filteredSchedules.filter(s => s.tag === activeTab);
  }, [filteredSchedules, activeTab]);

  // Add new schedule
  const addSchedule = useCallback((newSchedule: Omit<Schedule, 'id' | 'isExpanded'>) => {
    const id = Date.now().toString();
    setSchedules(prev => [...prev, { ...newSchedule, id, isExpanded: false }]);
  }, []);

  // Toggle schedule expansion with animation
  const toggleSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  }, []);

  // Delete schedule
  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  // Render schedule card
  const renderScheduleCard = useCallback(({ item }: { item: Schedule & { isPast: boolean } }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const onLongPress = () => {
      Alert.alert('Link Actions', '', [
        { text: 'Delete', onPress: () => deleteSchedule(item.id) },
        { text: 'Copy Link', onPress: () => {} },
        { text: 'Share', onPress: () => {} },
        { text: 'Cancel' },
      ]);
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: item.isPast ? 0.5 : 1,
    }));

    return (
      <Animated.View style={[styles.card, { backgroundColor: item.color }, animatedStyle]}>
        <Pressable onLongPress={onLongPress} style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <TouchableOpacity onPress={() => toggleSchedule(item.id)}>
              <Ionicons 
                name={item.isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          {item.isExpanded && (
            <View style={styles.cardDetails}>
              <Text style={styles.cardTime}>
                {item.startTime.toLocaleTimeString()} - {item.endTime.toLocaleTimeString()}
              </Text>
              <Text style={styles.cardLocation}>
                {item.locationType === 'online' ? '📱 Online' : '📍 Offline'}
                {item.location && ` - ${item.location}`}
              </Text>
              {item.link && (
                <Link href={item.link}>
                  <LinkTrigger style={styles.linkTrigger}>
                    <Text style={styles.linkText}>🔗 View Link</Text>
                  </LinkTrigger>
                  <LinkMenu>
                    <LinkMenuAction title="Delete" icon="trash" destructive onPress={() => deleteSchedule(item.id)} />
                    <LinkMenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />
                    <LinkMenuAction title="Share" icon="square.and.arrow.up" onPress={() => {}} />
                  </LinkMenu>
                </Link>
              )}
              <Text style={styles.cardTag}>{item.tag.toUpperCase()}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }, [toggleSchedule, deleteSchedule]);

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {(['meetings', 'events', 'holidays'] as const).map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render date picker
  const renderDateSection = () => (
    <View style={styles.dateSection}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.currentDate}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </TouchableOpacity>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          setShowDatePicker(false);
          if (date) setSelectedDate(date);
        }}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors[0] }]}>
      {/* Header with Search & Sort */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search schedules..."
          placeholderTextColor="#a9af90"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortMenu(true)}>
          <Text style={styles.sortButtonText}>Sort</Text>
          <Ionicons name="funnel" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Section */}
      {renderDateSection()}

      {/* Tabs */}
      {renderTabs()}

      {/* Schedules List/Grid */}
      <FlatList
        ref={flatListRef}
        data={tabSchedules}
        renderItem={renderScheduleCard}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={[
          styles.listContainer,
          viewMode === 'grid' && styles.gridContainer
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Left Sidebar - Roadmap */}
      <View style={styles.roadmapSidebar}>
        <Text style={styles.roadmapTitle}>📅 Roadmap</Text>
        {schedules.map(schedule => (
          <View key={schedule.id} style={[styles.roadmapItem, { backgroundColor: schedule.color }]}>
            <Text style={styles.roadmapTime}>{schedule.startTime.toLocaleTimeString()}</Text>
            <Text style={styles.roadmapName} numberOfLines={1}>{schedule.name}</Text>
          </View>
        ))}
      </View>

      {/* Create Schedule Modal */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Sort Dropdown Modal */}
      <Modal visible={showSortMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSortMenu(false)}
        >
          <View style={styles.sortModal}>
            {(['name', 'date', 'tag', 'color'] as const).map(option => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option);
                  setShowSortMenu(false);
                }}
              >
                <Text style={styles.sortOptionText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                <Ionicons name="checkmark" size={20} color={sortBy === option ? '#fff' : 'transparent'} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.sortOption} onPress={() => {setViewMode(v => v === 'list' ? 'grid' : 'list'); setShowSortMenu(false);}}>
              <Text style={styles.sortOptionText}>{viewMode === 'list' ? 'Grid View' : 'List View'}</Text>
              <Ionicons name="checkmark" size={20} color={false ? '#fff' : 'transparent'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="slide">
        <CreateScheduleModal
          formData={formData}
          setFormData={setFormData}
          onSave={addSchedule}
          onClose={() => setShowCreateModal(false)}
          colors={colors}
        />
      </Modal>
    </View>
  );
};

interface CreateScheduleModalProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSave: (schedule: Omit<Schedule, 'id' | 'isExpanded'>) => void;
  onClose: () => void;
  colors: string[];
}

const CreateScheduleModal = ({ formData, setFormData, onSave, onClose, colors }: CreateScheduleModalProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.modalTitle}>Create Schedule</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Schedule Name"
          value={formData.name}
          onChangeText={text => setFormData({ ...formData, name: text })}
        />

        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
          <Text>Start: {formData.startTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={formData.startTime}
            mode="datetime"
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setFormData({ ...formData, startTime: date });
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
          <Text>End: {formData.endTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={formData.endTime}
            mode="datetime"
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setFormData({ ...formData, endTime: date });
            }}
          />
        )}

        <Picker
          selectedValue={formData.locationType}
          onValueChange={value => setFormData({ ...formData, locationType: value })}
        >
          <Picker.Item label="Online" value="online" />
          <Picker.Item label="Offline" value="offline" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Location / Meeting Link"
          value={formData.location}
          onChangeText={text => setFormData({ ...formData, location: text, link: text })}
        />

        <Picker
          selectedValue={formData.tag}
          onValueChange={value => setFormData({ ...formData, tag: value })}
        >
          <Picker.Item label="Meeting" value="meeting" />
          <Picker.Item label="Event" value="event" />
          <Picker.Item label="Holiday" value="holiday" />
        </Picker>

        <View style={styles.colorPicker}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[styles.colorOption, { backgroundColor: color }]}
              onPress={() => setFormData({ ...formData, color })}
            />
          ))}
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#586c5c',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#85937a',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dateSection: {
    marginBottom: 16,
  },
  currentDate: {
    color: '#dfdcb9',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#586c5c',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#85937a',
  },
  tabText: {
    color: '#a9af90',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  gridContainer: {
    paddingHorizontal: 4,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  cardDetails: {
    gap: 8,
  },
  cardTime: {
    color: '#dfdcb9',
    fontSize: 14,
  },
  cardLocation: {
    color: '#a9af90',
    fontSize: 14,
  },
  linkTrigger: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginTop: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
  },
  cardTag: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roadmapSidebar: {
    position: 'absolute',
    left: 16,
    top: 200,
    width: 120,
    backgroundColor: 'rgba(33,46,50,0.9)',
    borderRadius: 16,
    padding: 16,
    maxHeight: screenHeight - 300,
  },
  roadmapTitle: {
    color: '#dfdcb9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  roadmapItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  roadmapTime: {
    color: '#a9af90',
    fontSize: 12,
  },
  roadmapName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#85937a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModal: {
    backgroundColor: '#202e32',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#586c5c',
  },
  sortOptionText: {
    color: '#dfdcb9',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#202e32',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#586c5c',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#586c5c',
  },
  saveButton: {
    backgroundColor: '#85937a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScheduleScreen;
