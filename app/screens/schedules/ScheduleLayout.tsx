// screens/ScheduleScreen.tsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
import { useSchedules } from '../../../context/ScheduleContext';
import { Schedule,  isSchedulePast } from '../../../types/schedule';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import theme, { GlassTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// import { LinkPreview } from 'expo-link-preview';  // depends on actual library

const COLORS = {
  bg: '#202e32',
  cardSoft: '#dfdcb9',
  accent1: '#85937a',
  accent2: '#586c5c',
  accent3: '#a9af90',
  textLight: '#f7f7f7',
  textDim: '#c2c2c2',
};

type TabKey = 'meeting' | 'event' | 'holiday';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'meeting', label: 'Meetings' },
  { key: 'event', label: 'Events' },
  { key: 'holiday', label: 'Holiday' },
];

type SortKey = 'name' | 'date' | 'tag' | 'color';

// export const ScheduleScreens: React.FC = () => {
const ScheduleScreen = () => {
  const theme = GlassTheme.dark;
  const { schedules, deleteSchedule } = useSchedules();

  const [now, setNow] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<TabKey>('meeting');
  const [searchText, setSearchText] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Live clock for "current date" banner
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Date range: show 7 days around selected for the strip
  const dateStrip = useMemo(() => {
    const base = new Date(selectedDate);
    base.setHours(0, 0, 0, 0);
    const days: Date[] = [];
    for (let i = -2; i <= 4; i += 1) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Filter and search schedules
  const filteredSchedules = useMemo(() => {
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const currentDayKey = dayKey(selectedDate);

    let list = schedules.filter(
      s => dayKey(s.start) === currentDayKey && s.tag === activeTab
    );

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.tag.toLowerCase().includes(q) ||
          s.locationLabel.toLowerCase().includes(q)
      );
    }

    list = list.slice().sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tag':
          return a.tag.localeCompare(b.tag);
        case 'color':
          return a.color.localeCompare(b.color);
        default:
          return a.start.getTime() - b.start.getTime();
      }
    });

    return list;
  }, [schedules, selectedDate, activeTab, searchText, sortKey]);

  // Roadmap entries (just time + name on left)
  const roadmap = useMemo(
    () =>
      filteredSchedules.map(s => ({
        id: s.id,
        label: s.name,
        timeLabel: `${s.start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        past: isSchedulePast(s, now),
      })),
    [filteredSchedules, now]
  );

  const toggleExpand = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }, []);

  const handleLongPressCard = useCallback((item: Schedule) => {
    // Here you’d open a modal/sheet including a Link preview.
    // Example:
    // setPreview({ visible: true, schedule: item });
  }, []);

  const renderScheduleCard = useCallback(
    ({ item }: { item: Schedule }) => {
      const past = isSchedulePast(item, now);
      const expanded = expandedIds.has(item.id);
      const timeRange = `${item.start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${item.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const baseCardStyle = [
        styles.card,
        { backgroundColor: item.color || COLORS.cardSoft },
        past && styles.cardPast,
      ];

      return (
        <Pressable
          style={baseCardStyle}
          onPress={() => toggleExpand(item.id)}
          onLongPress={() => handleLongPressCard(item)}
        >
          {/* top row */}
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{timeRange}</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
            </View>
          </View>

          {/* location summary */}
          <Text style={styles.cardLocation}>
            {item.locationType === 'online'
              ? `${item.locationLabel}${item.locationUrl ? ' · link attached' : ''}`
              : item.locationLabel}
          </Text>

          {/* collapsed by default, extra info when expanded */}
          {expanded && (
            <View style={styles.cardExpanded}>
              {item.notes ? (
                <Text style={styles.cardNotes}>{item.notes}</Text>
              ) : null}
              <Text style={styles.cardMeta}>
                Created {item.createdAt.toLocaleDateString()}
              </Text>
            </View>
          )}
        </Pressable>
      );
    },
    [expandedIds, handleLongPressCard, now, toggleExpand]
  );

  const keyExtractor = useCallback((item: Schedule) => item.id, []);

  // Sort dropdown button stub; plug into your own dropdown lib
  const handleSortChange = useCallback((next: SortKey) => {
    setSortKey(next);
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode(prev => (prev === 'list' ? 'grid' : 'list'));
  }, []);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerRow}>
        <Link href='/Home' replace dismissTo>
          <Ionicons name='chevron-back' size={30} color={theme.checkerText} />
        </Link>
        <Text style={[styles.headerTitle, styles.label]}>Schedule</Text>


        <TouchableOpacity
          style={styles.sortButton}
          onPress={handleToggleView}
        >
          <Ionicons name='ellipsis-horizontal' size={20}  style={{ color: theme.checkerTextSecondary }} />          
          {/* <Text style={styles.sortText}>
            {viewMode === 'list' ? 'List view' : 'Grid view'}
          </Text> */}
        </TouchableOpacity>
        {/* Another button could open a dropdown to select sort key */}
      </View>

      {/* month + date strip */}
      <View style={styles.monthRow}>
        {/* <TouchableOpacity>
          <Text style={styles.chevron}>{'<'}</Text>
        </TouchableOpacity> */}
        <Text style={styles.monthText}>
          {selectedDate.toLocaleString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            weekday: 'short',
          })}
        </Text>
        {/* <TouchableOpacity>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        horizontal
        data={dateStrip}
        keyExtractor={d => d.toISOString()}
        style={styles.dateStrip}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected =
            item.toDateString() === selectedDate.toDateString();
          const isToday = item.toDateString() === now.toDateString();
          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(item)}
              style={styles.dateItemContainer}
            >
            <View style={[
                styles.dateItem,
                isSelected && styles.dateItemSelected,
              ]}>
              <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                {item.toLocaleDateString(undefined, { weekday: 'short' })}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  isSelected && styles.dateNumSelected,
                ]}
              >
                {item.getDate().toString().padStart(1, '0')}
              </Text>

            </View>
            {isToday && !isSelected && (
              <View style={styles.todayDot} />
            )}
            </TouchableOpacity>
          );
        }}
      />

      {/* search + sort */}
      <View style={styles.searchRow}>

        <Link href="/screens/schedules/createSchedule" push style={{ alignItems: 'center', padding: 12 }}>
          <IconSymbol name="plus" size={20} color={ theme.checkerTextSecondary } />
        </Link>

        <View style={[styles.searchInputWrap]}>
          <View style={[styles.input]}>
            <TextInput
              placeholder=""
              placeholderTextColor={COLORS.textDim}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[styles.sortButton, {backgroundColor: 'transparent'}]}
              onPress={handleToggleView}>
                <Ionicons name='search' size={20} style={{ color: theme.checkerTextSecondary }} />          
            </TouchableOpacity>
          </View>
        </View>
      </View>


      {/* tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabItem,
                active && styles.tabItemActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  active && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>


      <View style={styles.contentRow}>
        {/* Left roadmap */}
        <View style={styles.roadmapColumn}>
          <FlatList
            data={roadmap}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.roadmapItem}>
                <View
                  style={[
                    styles.roadmapDot,
                    item.past && styles.roadmapDotPast,
                  ]}
                />
                <View style={styles.roadmapTextWrap}>
                  <Text style={styles.roadmapTime}>{item.timeLabel}</Text>
                  <Text
                    style={[
                      styles.roadmapLabel,
                      item.past && styles.roadmapLabelPast,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        
        {/* Right list/grid */}
        <View style={styles.cardsColumn}>
          <FlatList
            data={filteredSchedules}
            keyExtractor={keyExtractor}
            renderItem={renderScheduleCard}
            numColumns={viewMode === 'grid' ? 2 : 1}
            columnWrapperStyle={
              viewMode === 'grid' ? { gap: 10 } : undefined
            }
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        </View>




          {schedules.length === 0  ? (
            <View style={styles.noScheduleTab}>
                <View >
                  <Text style={{ color: theme.checkerTextTertiary }}>Nothing here...</Text>
              </View>
            </View>
          ):(
            ""
          )}


      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.checkerSurface,
    paddingTop: 24,
    paddingHorizontal: 10,
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

  label: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.dark.checkerTextSecondary,
    
    },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 12,
    padding: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#85937a',
    width: 30,
    textAlign: 'center',
  },
  monthText: {
    color: theme.dark.checkerTextSecondary,
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  dateStrip: {
    flexGrow: 0,
    marginBottom:25,
    height: 100
  },
  dateItemContainer:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateItem: {
    alignItems: 'center',
    padding: 13,
    backgroundColor: theme.dark.glassOverlay,
    marginHorizontal: 6,
    borderRadius: theme.radius.large,
    gap: 3,
    width:58,
  },
  dateItemSelected: {
    backgroundColor: theme.dark.checkerSuccess,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 4,
    paddingVertical: 15,
    borderRadius: theme.radius.large,
    gap: 2,
    width:78,
  },
  dateDay: {
    color: theme.dark.checkerTextSecondary,
    fontWeight: '500',
    fontSize: 15,
  },
  dateDaySelected: {
    color: '#000',
    fontWeight: '900',
    fontSize: 22,
    // textTransform: 'uppercase'
  },
  dateNum: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginTop: 1,
  },
  dateNumSelected: {
    color: '#000',
    fontSize: 25,
    fontWeight: '900',
  },
  todayDot: {
    width: 7,
    height: 7,
    borderRadius: 3,
    backgroundColor: 'red',
    marginTop: 7,
  },
  searchRow: {
    width:'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  blurButtonWrap: {
    borderWidth: .5,
    borderColor: theme.dark.checkerBorder,
    borderRadius: theme.radius.extraxLarge,
    // backgroundColor: theme.dark.checkerError,
    overflow: "hidden",
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: theme.radius.extraLarge,
    width: 'auto',
    gap:7,
    backgroundColor: theme.dark.glassDark,
    padding: 5,
  },
  input: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    color: theme.dark.checkerText,
  },
  sortButton: {
    backgroundColor: theme.dark.glassOverlay,
    borderRadius: theme.radius.small,
    padding: 9,
  },
  sortText: {
    color: theme.dark.checkerTextSecondary,
    fontSize: 13,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.dark.glassOverlay,
    borderRadius: 15,
    marginBottom: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
  },
  tabItemActive: {
    backgroundColor: theme.dark.checkerSuccess,
    paddingVertical: 8,

  },
  tabText: {
    color: '#dfdcb9',
    fontWeight: '500',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#202e32',
    fontWeight: '700',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  roadmapColumn: {
    width: 62,
    paddingTop: 4,
    marginRight: 6,
    alignItems: 'center',
  },
  roadmapItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  roadmapDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#85937a',
    marginBottom: 6,
  },
  roadmapDotPast: {
    backgroundColor: '#a9af90',
    opacity: 0.6,
  },
  roadmapTextWrap: {
    alignItems: 'center',
    width: 54,
  },
  roadmapTime: {
    fontSize: 11,
    color: '#dfdcb9',
    marginBottom: 2,
  },
  roadmapLabel: {
    color: '#85937a',
    fontSize: 12,
    textAlign: 'center',
  },
  roadmapLabelPast: {
    color: '#a9af90',
    opacity: 0.7,
  },
  cardsColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#dfdcb9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardPast: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#202e32',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  cardSub: {
    color: '#85937a',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  tagPill: {
    backgroundColor: '#a9af90',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    color: '#202e32',
    fontWeight: '700',
  },
  cardLocation: {
    color: '#586c5c',
    marginBottom: 3,
    fontSize: 14,
  },
  cardExpanded: {
    marginTop: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 8,
  },
  cardNotes: {
    color: '#202e32',
    marginBottom: 6,
    fontSize: 13,
  },
  cardMeta: {
    color: '#85937a',
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  noScheduleTab:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.dark.glassOverlay,
    borderRadius: theme.radius.extraxLarge,
  }
});

export default ScheduleScreen;

