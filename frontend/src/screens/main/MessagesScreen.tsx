import {useState} from "react";
import {FlatList, Pressable, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Search, X} from "lucide-react-native";
import {conversationMeta, currentUser, getEvent, getPerson, likesCount, newConnectionIds} from "../../data";
import type {TabScreenProps} from "../../navigation/types";
import {useMockQuery} from "../../hooks/useMockQuery";
import {formatShortDay} from "../../logic/dates";
import {Thread, useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Avatar from "../../ui/Avatar";
import IconButton from "../../ui/IconButton";
import SearchInput from "../../ui/SearchInput";
import {EmptyState, ErrorState, Skeleton} from "../../ui/States";
import Text from "../../ui/Text";

function ChatRow({thread, onPress}: {thread: Thread; onPress: () => void}) {
  const theme = useTheme();
  const person = getPerson(thread.with)!;
  const event = getEvent(thread.eventId);
  const last = thread.messages[thread.messages.length - 1];
  const unread = thread.unread > 0;
  const preview = last ? `${last.from === currentUser.id ? "Tu: " : ""}${last.text}` : "Spune salut!";
  const time = conversationMeta[thread.with]?.time && last?.from !== currentUser.id ? conversationMeta[thread.with].time : last?.at ?? "";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${person.firstName}${unread ? `, ${thread.unread} mesaje necitite` : ""}. ${preview}`}
      onPress={onPress}
      style={{flexDirection: "row", gap: theme.space.lg, alignItems: "center", paddingVertical: theme.space.lg, paddingHorizontal: theme.space.screenX, borderBottomWidth: 1, borderBottomColor: theme.color.divider}}
    >
      <Avatar name={person.firstName} personId={person.id} size={theme.size.avatarMd}/>
      <View style={{flex: 1, gap: 2}}>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "baseline"}}>
          <Text weight={600} style={{fontSize: theme.fontSize.bodyLg}}>{person.firstName}</Text>
          <Text variant="tab" weight={unread ? 600 : 400} color={unread ? theme.color.accentText : theme.color.muted}>{time}</Text>
        </View>
        <Text numberOfLines={1} weight={unread ? 600 : 400} color={unread ? theme.color.ink : theme.color.muted} style={{fontSize: theme.fontSize.label}}>{preview}</Text>
        {event && <Text variant="tab" color={theme.color.muted} weight={400}>{event.title.split(" @")[0]} · {formatShortDay(event.startsAt)}</Text>}
      </View>
      {unread && <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: theme.color.accent}}/>}
    </Pressable>
  );
}

export default function MessagesScreen({navigation}: TabScreenProps<"Messages">) {
  const theme = useTheme();
  const {threads} = useStore();
  const {status, retry} = useMockQuery();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const visible = threads.filter((t) => getPerson(t.with)?.firstName.toLowerCase().includes(query.trim().toLowerCase()));
  const openChat = (id: string) => navigation.navigate("Conversation", {id});

  const header = (
    <View style={{gap: theme.space["2xl"], paddingBottom: theme.space.xxs}}>
      <View style={{paddingHorizontal: theme.space.screenX, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text variant="page" accessibilityRole="header">Mesaje</Text>
        <IconButton
          accessibilityLabel={searchOpen ? "Închide căutarea" : "Caută în mesaje"}
          onPress={() => { setQuery(""); setSearchOpen((o) => !o); }}
          icon={searchOpen
            ? <X size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
            : <Search size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>}
        />
      </View>
      {searchOpen && (
        <View style={{paddingHorizontal: theme.space.screenX, flexDirection: "row"}}>
          <SearchInput autoFocus placeholder="Caută o persoană" value={query} onChangeText={setQuery}/>
        </View>
      )}
      {!searchOpen && (
        <View style={{gap: theme.space.md}}>
          <Text variant="label" color={theme.color.muted} style={{paddingHorizontal: theme.space.screenX}}>Conexiuni noi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: theme.space.xl, paddingHorizontal: theme.space.screenX, paddingVertical: 2}}>
            <Pressable accessibilityRole="button" accessibilityLabel={`${likesCount} like-uri. Vezi în Connect`} onPress={() => navigation.navigate("Connect")}
                       style={{width: 62, alignItems: "center", gap: theme.space.xs}}>
              <View style={{width: 58, height: 58, borderRadius: 29, backgroundColor: theme.color.accentSoft, alignItems: "center", justifyContent: "center"}}>
                <Text weight={700} color={theme.color.accentText} style={{fontSize: theme.fontSize.button}}>{likesCount}</Text>
              </View>
              <Text variant="meta" weight={500}>Like-uri</Text>
            </Pressable>
            {newConnectionIds.map((id) => {
              const p = getPerson(id)!;
              return (
                <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Conexiune nouă: ${p.firstName}`} onPress={() => openChat(id)}
                           style={{width: 62, alignItems: "center", gap: theme.space.xs}}>
                  <View style={{width: 62, height: 62, borderRadius: 31, borderWidth: 1.5, borderColor: theme.color.accent, alignItems: "center", justifyContent: "center"}}>
                    <Avatar name={p.firstName} personId={id} size={54}/>
                  </View>
                  <Text variant="meta" weight={500}>{p.firstName}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
      <Text variant="label" color={theme.color.muted} style={{paddingHorizontal: theme.space.screenX}}>Conversații</Text>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={{flex: 1, backgroundColor: theme.color.bg}}>
      {status === "loading" && (
        <View style={{padding: theme.space.screenX, gap: theme.space["2xl"]}}>
          <Skeleton width={140} height={24}/>
          <View style={{flexDirection: "row", gap: theme.space.xl}}>{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} width={58} height={58} radius={29}/>)}</View>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{flexDirection: "row", gap: theme.space.lg, alignItems: "center"}}>
              <Skeleton width={50} height={50} radius={25}/>
              <View style={{flex: 1, gap: theme.space.sm}}><Skeleton width="40%" height={12}/><Skeleton width="75%" height={10}/></View>
            </View>
          ))}
        </View>
      )}
      {status === "error" && <ErrorState onRetry={retry}/>}
      {status === "success" && (
        <FlatList
          data={visible}
          keyExtractor={(t) => t.with}
          ListHeaderComponent={header}
          contentContainerStyle={{paddingTop: theme.space.screenX, paddingBottom: theme.space["3xl"]}}
          renderItem={({item}) => <ChatRow thread={item} onPress={() => openChat(item.with)}/>}
          ListEmptyComponent={
            query
              ? <EmptyState title="Nicio conversație" message={`Nu am găsit pe nimeni după „${query}”.`}/>
              : <EmptyState title="Încă nu ai conversații" message="Fă match în Connect cu cineva care merge la același eveniment." action="Mergi la Connect" onAction={() => navigation.navigate("Connect")}/>
          }
        />
      )}
    </SafeAreaView>
  );
}
