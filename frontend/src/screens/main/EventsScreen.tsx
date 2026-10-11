import {useEffect, useMemo, useState} from "react";
import {FlatList, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Map, Search, X} from "lucide-react-native";
import {CATEGORIES, CITY, events, PROTOTYPE_NOW} from "../../data";
import type {Category} from "../../data/types";
import type {TabScreenProps} from "../../navigation/types";
import {useMockQuery} from "../../hooks/useMockQuery";
import {eventCountLabel, filterEvents, WhenFilter} from "../../logic/events";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Chip from "../../ui/Chip";
import {EventRow} from "../../ui/EventViews";
import IconButton from "../../ui/IconButton";
import SearchInput from "../../ui/SearchInput";
import {EmptyState, ErrorState, EventListSkeleton} from "../../ui/States";
import Text from "../../ui/Text";
import TextTabs from "../../ui/TextTabs";

const WHEN_TABS: {id: WhenFilter; label: string}[] = [
  {id: "all", label: "Oricând"},
  {id: "today", label: "Azi"},
  {id: "week", label: "Săptămâna asta"},
];

export default function EventsScreen({navigation, route}: TabScreenProps<"Events">) {
  const theme = useTheme();
  const {saved, toggleSaved, showToast} = useStore();
  const {status, retry} = useMockQuery();
  const [category, setCategory] = useState<Category | "all">("all");
  const [when, setWhen] = useState<WhenFilter>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Filters passed from Home (category chips, search)
  useEffect(() => {
    if (route.params?.category) setCategory(route.params.category);
    if (route.params?.query !== undefined) {
      setQuery(route.params.query);
      setSearchOpen(route.params.query.length > 0);
    }
  }, [route.params]);

  const list = useMemo(() => filterEvents(events, {category, when, query}, PROTOTYPE_NOW), [category, when, query]);

  const resetFilters = () => {
    setCategory("all");
    setWhen("all");
    setQuery("");
  };

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bgWarm}}>
      <View style={{paddingTop: theme.space.screenX, paddingHorizontal: theme.space.screenX, gap: theme.space.xl, backgroundColor: theme.color.bg, borderBottomWidth: 1, borderBottomColor: theme.color.border}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <View style={{gap: 2}}>
            <Text variant="page" accessibilityRole="header">Evenimente</Text>
            <Text variant="meta" color={theme.color.muted} accessibilityLiveRegion="polite">{eventCountLabel(list.length)} în {CITY}</Text>
          </View>
          <View style={{flexDirection: "row", gap: theme.space.sm}}>
            <IconButton
              accessibilityLabel={searchOpen ? "Închide căutarea" : "Caută"}
              onPress={() => { if (searchOpen) setQuery(""); setSearchOpen((o) => !o); }}
              icon={searchOpen
                ? <X size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
                : <Search size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}
            />
            <IconButton accessibilityLabel="Vezi pe hartă" onPress={() => showToast("Harta vine în curând")}
                        icon={<Map size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}/>
          </View>
        </View>

        {searchOpen && (
          <View style={{flexDirection: "row"}}>
            <SearchInput autoFocus placeholder="Caută după nume sau loc…" value={query} onChangeText={setQuery}/>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Categorie"
                    style={{marginHorizontal: -theme.space.screenX}}
                    contentContainerStyle={{paddingHorizontal: theme.space.screenX, gap: theme.space.sm}}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.label} selected={category === c.id} onPress={() => setCategory(c.id)}/>
          ))}
        </ScrollView>

        <TextTabs tabs={WHEN_TABS} value={when} onChange={setWhen}/>
      </View>

      {status === "loading" && <View style={{paddingHorizontal: theme.space.screenX}}><EventListSkeleton/></View>}
      {status === "error" && <ErrorState onRetry={retry}/>}
      {status === "success" && (
        <FlatList
          data={list}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{paddingHorizontal: theme.space.screenX, paddingTop: theme.space.xxs, paddingBottom: theme.space["3xl"]}}
          renderItem={({item}) => (
            <EventRow
              event={item}
              saved={saved.has(item.id)}
              onToggleSaved={() => toggleSaved(item.id)}
              onPress={() => navigation.navigate("EventDetail", {id: item.id})}
            />
          )}
          ListEmptyComponent={
            <EmptyState title="Nimic aici încă" message="Încearcă altă categorie sau altă perioadă."
                        action="Resetează filtrele" onAction={resetFilters}/>
          }
        />
      )}
    </SafeAreaView>
  );
}
