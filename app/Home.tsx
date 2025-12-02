// App.js
import { RootState } from "@/src/store";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import theme, { GlassTheme } from '../constants/theme';
import { addTodo, removeTodo, setTodos, Todo, toggleTodo } from '../src/store/slices/todoSlice';
import { deleteTodo, getAllTodos, initDb, insertTodo, updateTodoCompletion } from '../src/utils/sqlite';
import WorkSpaceScreen from "./screens/WorkSpaceScreen";
import { Checkbox } from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import RecordVideoModal from "./components/RecordVideoModal";
import RecordAudioModal from "./components/RecordAudioModal";


function makeId() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 8);
}


export default function AppIo() {
  const [text, setText] = useState('');
  const theme = GlassTheme.dark;
  const dispatch = useDispatch();
  const todos = useSelector((s: RootState) => s.todo.items);
  const [isChecked, setChecked] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const router = useRouter();
  const r: any = router;

  
  const onAdd = useCallback(async () => {
    if (!text.trim()) return;
    const id = makeId();
    const title = text.trim();
    try {
      await insertTodo(id, title, 0);
      dispatch(addTodo({ id, title }));
      setText('');
    } catch (err) {
      Alert.alert('Error', 'Failed to add todo');
      console.warn(err);
    }
  }, [text, dispatch]);
  
  useEffect(() => {
    (async () => {
      try {
        await initDb();
        const rows = await getAllTodos();
        // map completed integer to boolean
        const items: Todo[] = rows.map((r) => ({ id: r.id, title: r.title, completed: !!r.completed, createdAt: r.createdAt }));
        dispatch(setTodos(items));
      } catch (err) {
        console.warn('DB init/load failed', err);
      }
    })();
  }, [dispatch]);
  

  const tabs = [
    { id: 1, label: "All", count: 12, active: true },
    { id: 2, label: "recent", count: 12, },
    { id: 3, label: "Inspiration", count: 15 },
    { id: 4, label: "Work", count: 28 },
  ];
 

  const onToggle = useCallback(async (id: string) => {
    try {
      const t = todos.find((x) => x.id === id);
      if (!t) return;
      const newCompleted = t.completed ? 0 : 1;
      await updateTodoCompletion(id, newCompleted);
      dispatch(toggleTodo({ id }));
    } catch (err) {
      console.warn(err);
    }
  }, [todos, dispatch]);
  
  const onDelete = useCallback(async (id: string) => {
      try {
        await deleteTodo(id);
        dispatch(removeTodo({ id }));
      } catch (err) {
        console.warn(err);
      }
    }, [dispatch]);

  const renderItem = ({ item }: { item: Todo }) => (
    <BlurView intensity={40} style={styles.glassRow}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={[styles.checkbox, { borderColor: theme.borderMedium }]}>
        <Text style={styles.checkmark}>{item.completed ? '✓' : ''}</Text>
      </TouchableOpacity>
      <Text style={[styles.itemText, item.completed && styles.completed]}>{item.title}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.del}>
        <Text style={{ color: theme.danger, fontWeight: '600' }}>Delete</Text>
      </TouchableOpacity>
    </BlurView>
  );


  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light" /> */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <BlurView intensity={80} style={styles.headerGlass}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.check }]}>Home</Text>
              <Text style={[styles.subtitle, { color: theme.textTertiary }]}>Your tasks and quick insights live here.</Text>
            </View>
            <Ionicons name="person-circle" size={40} color="#111827" style={{ color: theme.check }} />
        </BlurView>


        {/* // Inside your component: */}
    
        {/* <View style={styles.section}>
          <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
          <Text style={styles.paragraph}>Normal checkbox</Text>
        </View> */}

        {/* To-do card */}
        <View style={styles.todoCard}>
          <View style={styles.todoHeaderRow}>
            <View>
              <Text style={styles.todoTitle}>To-Do List</Text>
              <Text style={styles.todoSubtitle}>
                Today is Friday, February 1
              </Text>
            </View>
          </View>


          <View style={styles.todoList}>
            {todos.map((item) => (
              <View key={item.id} style={styles.todoItemRow}>
                <View
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxDone,
                  ]}
                >
                  {item.completed && (
                    <Feather name="check" size={16} color="#ffffff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.todoItemText,
                    item.completed && styles.todoItemTextDone,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
          <Pressable >
              <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
          </Pressable>
        </View>


        <View style={styles.headerRow}>
          <Text style={[styles.logo, {color: theme.checkLight}]}>Note</Text>
          <Ionicons name="search-outline" size={24} color={theme.checkLight} />
        </View>

        {/* <BlurView intensity={40} style={styles.inputGlass}>
          <View style={styles.inputRow}>
            <TextInput 
              placeholder="New todo" 
              value={text} 
              onChangeText={setText} 
              style={[styles.input, { borderColor: theme.borderLight, color: theme.text }]}
              placeholderTextColor={theme.textTertiary}
            />
            <TouchableOpacity onPress={onAdd} style={[styles.addBtn, { backgroundColor: theme.text }]}>
              <Text style={{ color: theme.textTertiary, fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
          </View>
        </BlurView> */}

          <View style={styles.tabsRows}>

            <BlurView intensity={50} tint="dark" style={[styles.bottomButton]}>
                <TouchableOpacity>
                  <Feather name="sliders" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </BlurView>


            <FlatList 
                data={tabs} 
                horizontal={true}
                keyExtractor={(i) => i.id.toString()} 
                renderItem={({ item }) => (
                  
                  // <BlurView intensity={50} tint="dark" style={[styles.bottomButton]}>
                  <TouchableOpacity
                    style={[
                      styles.tabChip,
                      item.active && styles.tabChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        item.active && styles.tabTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <View
                      style={[
                        styles.tabBadge,
                        item.active && styles.tabBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabBadgeText,
                          item.active && styles.tabBadgeTextActive,
                        ]}
                      >
                        {item.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  // </BlurView>

                )}
            />
          </View>
        {/* Tabs */}
        {/* <View style={styles.tabsRow}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={[
                styles.tabChip,
                t.active && styles.tabChipActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  t.active && styles.tabTextActive,
                ]}
              >
                {t.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  t.active && styles.tabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    t.active && styles.tabBadgeTextActive,
                  ]}
                >
                  {t.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View> */}



                  

        {/* Notes grid */}
        <View style={styles.notesRow}>
          {/* Right locked note */}
            <View style={[styles.noteCard,styles.lockedCard, ]}>
              <Link href="/screens/WorkSpaceScreen" >
                {/* <Link.Trigger>klklklklklk</Link.Trigger> */}
                
                  {/* <Link.Trigger style={styles.lockedNoteContent}>
                    <Feather name="lock" size={32} color="#9CA3AF" />
                  
                    <Text style={styles.lockedText}>Locked Note</Text>
                  </Link.Trigger> */}
                {/* <Link.Preview style={{ width: 500, height: 500, }}/> */}


              <Link.Trigger>About</Link.Trigger>
              <Link.Trigger>Content</Link.Trigger>
              <Link.Preview/>
              </Link>
            </View>




            <Link href="/screens/SignUpScreen">
              <Link.Trigger>About</Link.Trigger>
              <Link.Trigger>Content</Link.Trigger>
              <Link.Preview >
                {/* <Image
                  onLoad={e => setImageSize(e.nativeEvent.source)}
                  source={source}
                  style={{ width: '100%', height: '100%' }}
                /> */}
              </Link.Preview>
            </Link>




          {/* Left note */}
          <TouchableOpacity style={[styles.noteCard]}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteImagePlaceholder} />
            <Text style={styles.noteTitle}>Geometric poster collection</Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
            <Text style={styles.noteBody} numberOfLines={3}>
              Geometric poster design focuses on the geometric lines,
              shapes, and patterns that exist in modern art.
            </Text>
          </TouchableOpacity>
          {/* <Link href="/screens/SignUpScreen">
            <Link.Trigger>About</Link.Trigger>
            <Link.Preview />
          </Link> */}
          {/* <Link href="/screens/SignUpScreen">
            <Link.Trigger>About</Link.Trigger>
            <Link.Preview />
          </Link> */}




          {/* <TouchableOpacity style={styles.noteCard}>
            <View style={styles.lockedCard}>
              <Feather name="lock" size={32} color="#9CA3AF" />
              <Text style={styles.lockedText}>Locked Note</Text>
            </View>
          </TouchableOpacity> */}
        </View>



        <FlatList
          data={todos}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          scrollEnabled={true}
        />

        {/* <WorkSpaceScreen /> */}

        </ScrollView>


        {/* Bottom bar */}
        <View style={styles.bottomBar}>
            <BlurView intensity={50} tint="dark" style={[styles.bottomButton]}>
              <TouchableOpacity>
                <Feather name="mic" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </BlurView>


            <BlurView intensity={50} tint="dark" style={[styles.bottomButton, styles.buttonInner]}>
              {/* <Link href="/Home" dismissTo asChild> */}
                <TouchableOpacity
                  onPress={() => setAddOpen((s) => !s)} 
                  activeOpacity={0.8}
                  // style={}
                  >
                  <Feather name="plus" size={26} color={theme.textSecondary} />
                </TouchableOpacity>
              {/* </Link> */}
            </BlurView>


            <View style={styles.addWrap}>
              {addOpen && (
                <BlurView intensity={50} style={styles.dropdownGlass}>
                  <TouchableOpacity onPress={() => (router.push("/screens/ImportScreen"), setAddOpen(false))} style={styles.dropItem}>
                    <Text style={{ color: theme.text, fontWeight: '500' }}>Import</Text>
                  </TouchableOpacity>
                  
                  
                  <TouchableOpacity onPress={() => (router.push("/screens/CreateTodosScreen"), setAddOpen(false))} style={styles.dropItem}>
                    <Text style={{ color: theme.text, fontWeight: '500' }}>Create Todos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => (setAudioOpen(true), setAddOpen(false))} style={styles.dropItem}>
                    <Text style={{ color: theme.text, fontWeight: '500' }}>Record Audio</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => (setVideoOpen(true), setAddOpen(false))} style={styles.dropItem}>
                    <Text style={{ color: theme.text, fontWeight: '500' }}>Record Video</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
            </View>


            <BlurView intensity={50} tint="dark" style={[styles.bottomButton]}>
                <TouchableOpacity onPress={() => router.push("/screens/SettingsScreen")}>
                  <Feather name="sliders" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </BlurView>
        </View>


        <RecordAudioModal visible={audioOpen} onClose={() => setAudioOpen(false)} />
        <RecordVideoModal visible={videoOpen} onClose={() => setVideoOpen(false)} />


    </SafeAreaView>
  );
}

const CARD_RADIUS = theme.radius;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#212121ff'
    backgroundColor: theme.dark.background,
  },
  scroll: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    fontSize: 26,
    fontWeight: "600",
  },
  inputGlass: {
    borderRadius: 14,
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...GlassTheme.shadow.subtle,
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12,
  },
  input: { 
    flex: 1, 
    borderWidth: 1,
    borderRadius: 10, 
    padding: 12, 
    marginRight: 10,
    backgroundColor: theme.dark.glassDark,
    fontSize: 15,
  },


  headerGlass: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius:  CARD_RADIUS.large,
    marginBottom: 16,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.3)',
    ...GlassTheme.shadow.light,
    
  },
  header: { 
    padding: 16,
    paddingBottom: 12,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  subtitle: { 
    fontSize: 13, 
    letterSpacing: 0.5,
  },



  addBtn: { 
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    borderRadius: 10,
    ...GlassTheme.shadow.subtle,
  },

  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: GlassTheme.light.primary,
  },
  itemText: { 
    flex: 1, 
    fontSize: 16,
    fontWeight: '500',
  },
  completed: { 
    textDecorationLine: 'line-through', 
    color: GlassTheme.light.textTertiary,
  },
  del: { 
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  glassRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  tabsRow: {
    flexDirection: "row",
    marginBottom: 22,
  },
  tabsRows: {
    flexDirection: "row",
    marginBottom: 22,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingLeft: 25,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.dark.glassMedium,
    marginRight: 9,
  },
  tabChipActive: {
    backgroundColor: theme.dark.checkLight,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.dark.textSecondary,
    textAlign: 'center',
    alignSelf: 'center'
  },
  tabTextActive: {
    fontWeight: 500,
    color: theme.dark.textTertiary,
  },
  tabBadge: {
    position: 'relative',
    bottom: 17,
    left: 12,
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.dark.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeActive: {
    backgroundColor: "#F9FAFB",
  },
  tabBadgeText: {
    fontSize: 12,
    color: theme.dark.text,
  },
  tabBadgeTextActive: {
    color: "#111827",
  },

  todoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: theme.dark.glassDark,
    borderRadius: CARD_RADIUS.extraLarge,
    padding: 18,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 18,
    height: 220,
  },
  todoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  todoTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: theme.dark.textSecondary,
  },
  todoSubtitle: {
    fontSize: 13,
    color: theme.dark.textSecondary,
    marginTop: 4,
  },
  // expandBtn: {
  //   width: 34,
  //   height: 34,
  //   borderRadius: 17,
  //   // backgroundColor: "#111827",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  todoList: {
    marginTop: 4,
  },
  todoItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.dark.textTertiary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121ff",
  },
  checkboxDone: {
    backgroundColor: "#06B6D4",
    borderColor: "#06B6D4",
  },
  todoItemText: {
    fontSize: 15,
    color: "#111827",
  },
  todoItemTextDone: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },

  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    flexWrap: 'wrap'
  },
  noteCard: {
    // flex: 1,
    minWidth: 178,
    maxWidth: 178,
    minHeight: 'auto',
    // height: 200,
    maxHeight: 350,
    overflow: 'hidden',
    backgroundColor: theme.dark.glassDark,
    borderRadius: CARD_RADIUS.extraLarge,
    padding: 10,
    marginVertical: 5
  },
  noteImagePlaceholder: {
    height: 110,
    borderRadius:  CARD_RADIUS.extraLarge,
    backgroundColor: theme.dark.glassMedium,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 19,
    fontWeight: "600",
    textAlign: 'justify',
    color: theme.dark.checkLight,
    marginBottom: 6,
  },
  noteBody: {
    fontSize: 13,
    textAlign: 'justify',
    color: "#6B7280",
  },
  lockedCard: {
    width: 270,
    height: 240,
    borderRadius: 20,
    backgroundColor: theme.dark.glassDark,
    borderWidth: 2,
    borderColor: 'blue',
  },
  lockedNoteContent:{
    flex: 1,
    width: 270,
    height: 240,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  lockedText: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  addWrap: { 
    position: 'relative', 
    right: 0, 
    left: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  addBtn2: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownGlass: { 
    position: 'absolute', 
    bottom: 42, 
    right: -50,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    paddingHorizontal: 30,
    borderColor: theme.dark.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 28,
  },
  dropItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },


  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    padding: 15,
    borderWidth: 1,
    borderColor: theme.dark.borderLight,
    borderRadius: theme.radius.extraLarge,
    overflow: "hidden",
  },
  
  buttonInner: {
    // padding: 15,
    width: 80, height: 80,
    alignItems: "center",
    // marginBottom: 12,
    borderRadius: theme.radius.extraxLarge,
    justifyContent: "center",
  },
});
