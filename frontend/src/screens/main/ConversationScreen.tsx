import {useEffect, useRef, useState} from "react";
import {Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ChevronLeft, ChevronRight, MoreHorizontal, Send} from "lucide-react-native";
import {currentUser, getEvent, getPerson} from "../../data";
import type {RootScreenProps} from "../../navigation/types";
import {formatShortDay} from "../../logic/dates";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import Avatar from "../../ui/Avatar";
import {EventImage} from "../../ui/Media";
import {EmptyState} from "../../ui/States";
import Text from "../../ui/Text";

export default function ConversationScreen({navigation, route}: RootScreenProps<"Conversation">) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {getThread, openThread, sendMessage, markRead} = useStore();
  const [draft, setDraft] = useState("");
  const list = useRef<FlatList>(null);
  const person = getPerson(route.params.id);
  const thread = getThread(route.params.id);

  useEffect(() => {
    if (person && !thread) openThread(person.id, (person.goingTo ?? [])[0] ?? "techno");
    if (person) markRead(person.id);
  }, [person?.id]);

  if (!person) {
    return (
      <View style={{flex: 1, paddingTop: insets.top + 40}}>
        <EmptyState title="Conversația nu mai există" message="Persoana și-a șters contul." action="Înapoi" onAction={() => navigation.goBack()}/>
      </View>
    );
  }

  const event = thread ? getEvent(thread.eventId) : undefined;
  const send = (text: string) => {
    sendMessage(person.id, text);
    setDraft("");
  };

  const contextCard = event && (
    <Pressable accessibilityRole="button" onPress={() => navigation.navigate("EventDetail", {id: event.id})}
               style={{flexDirection: "row", gap: theme.space.md, alignItems: "center", padding: theme.space.md, borderRadius: theme.radius.input, backgroundColor: theme.color.tintCard, borderWidth: 1, borderColor: theme.color.tintCardBorder, marginBottom: theme.space.md}}>
      <EventImage eventId={event.id} size={40} radius={theme.radius.thumbSm}/>
      <View style={{flex: 1, gap: 1}}>
        <Text variant="tab" weight={400} color={theme.color.muted}>V-ați conectat prin</Text>
        <Text weight={600} style={{fontSize: theme.fontSize.label}}>{event.title} · {formatShortDay(event.startsAt)}</Text>
      </View>
      <ChevronRight size={theme.icon.sm} color={theme.color.iconMuted} strokeWidth={theme.icon.stroke}/>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{flex: 1, backgroundColor: theme.color.bg}}>
      <View style={{paddingTop: insets.top, borderBottomWidth: 1, borderBottomColor: theme.color.border}}>
        <View style={{height: 72, paddingHorizontal: theme.space.md, flexDirection: "row", alignItems: "center", gap: theme.space.xs}}>
          <Pressable accessibilityRole="button" accessibilityLabel="Înapoi la mesaje" onPress={() => navigation.goBack()}
                     style={{width: theme.size.touch, height: theme.size.touch, alignItems: "center", justifyContent: "center"}}>
            <ChevronLeft size={theme.icon.lg} color={theme.color.accentText} strokeWidth={theme.icon.strokeActive}/>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Profilul lui ${person.firstName}`}
                     onPress={() => navigation.navigate("ProfileView", {id: person.id, eventId: thread?.eventId})}
                     style={{flexDirection: "row", alignItems: "center", gap: theme.space.md, flex: 1}}>
            <Avatar name={person.firstName} personId={person.id} size={theme.size.avatarSm}/>
            <View>
              <Text weight={600} style={{fontSize: theme.fontSize.bodyLg}}>{person.firstName}</Text>
              <Text variant="tab" weight={400} color={theme.color.muted}>Activ acum</Text>
            </View>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Mai multe opțiuni"
                     onPress={() => Alert.alert(person.firstName, undefined, [
                       {text: "Vezi profilul", onPress: () => navigation.navigate("ProfileView", {id: person.id})},
                       {text: "Raportează", style: "destructive"},
                       {text: "Anulează", style: "cancel"},
                     ])}
                     style={{width: theme.size.touch, height: theme.size.touch, alignItems: "center", justifyContent: "center"}}>
            <MoreHorizontal size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={list}
        data={thread?.messages ?? []}
        keyExtractor={(_, i) => String(i)}
        onContentSizeChange={() => list.current?.scrollToEnd({animated: true})}
        contentContainerStyle={{paddingTop: theme.space.xl, paddingHorizontal: 16, paddingBottom: theme.space.md, gap: theme.space.xs}}
        ListHeaderComponent={
          <View>
            {contextCard}
            <Text variant="tab" weight={400} color={theme.color.muted} style={{alignSelf: "center", paddingTop: 2, paddingBottom: theme.space.xs}}>Azi</Text>
          </View>
        }
        renderItem={({item}) => {
          const mine = item.from === currentUser.id;
          return (
            <View style={{flexDirection: "row", justifyContent: mine ? "flex-end" : "flex-start"}}>
              <View style={{
                maxWidth: "76%",
                backgroundColor: mine ? theme.color.accentText : theme.color.surfaceMuted,
                borderRadius: 18,
                borderBottomRightRadius: mine ? 4 : 18,
                borderBottomLeftRadius: mine ? 18 : 4,
                paddingVertical: 9,
                paddingHorizontal: 13,
                gap: 2,
              }}>
                <Text color={mine ? theme.color.onAccentFill : theme.color.ink} style={{lineHeight: 20}}>{item.text}</Text>
                <Text color={mine ? theme.color.onAccentFill : theme.color.ink} style={{fontSize: 10, alignSelf: "flex-end", opacity: 0.8}}>{item.at}</Text>
              </View>
            </View>
          );
        }}
      />

      {thread && thread.icebreakers.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled"
                    style={{flexGrow: 0}} contentContainerStyle={{height: 56, alignItems: "center", gap: theme.space.sm, paddingHorizontal: 16}}>
          {thread.icebreakers.map((q) => (
            <Pressable key={q} accessibilityRole="button" accessibilityLabel={`Trimite: ${q}`} onPress={() => send(q)}
                       style={{height: 36, paddingHorizontal: theme.space.lg, borderRadius: 18, borderWidth: 1, borderColor: theme.color.accentLine, backgroundColor: theme.color.bg, justifyContent: "center"}}>
              <Text weight={500} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={{paddingTop: theme.space.md, paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, theme.space.md), borderTopWidth: 1, borderTopColor: theme.color.border, flexDirection: "row", gap: theme.space.md, alignItems: "center"}}>
        <View style={{flex: 1, height: theme.size.touch, borderRadius: 22, backgroundColor: theme.color.surfaceMuted, paddingHorizontal: 16, justifyContent: "center"}}>
          <TextInput
            accessibilityLabel="Scrie un mesaj"
            placeholder="Scrie un mesaj…"
            placeholderTextColor={theme.color.muted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
            submitBehavior="submit"
            style={{fontFamily: theme.fontFamily[400], fontSize: theme.fontSize.body, color: theme.color.ink}}
          />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Trimite" onPress={() => send(draft)}
                   style={{width: theme.size.touch, height: theme.size.touch, borderRadius: 22, backgroundColor: theme.color.accentFill, alignItems: "center", justifyContent: "center"}}>
          <Send size={theme.icon.sm} color={theme.color.onAccentFill} strokeWidth={theme.icon.strokeActive}/>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
