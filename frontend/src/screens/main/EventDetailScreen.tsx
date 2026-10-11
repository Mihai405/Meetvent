import {ReactNode, useState} from "react";
import {Pressable, ScrollView, Share, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Bookmark, Calendar, Check, ChevronLeft, MapPin, Share2, Ticket} from "lucide-react-native";
import {CATEGORY_LABEL, CITY, currentUser, eventDescription, getEvent, people, venueAddress} from "../../data";
import type {RootScreenProps} from "../../navigation/types";
import {formatLongDate, formatTimeRange} from "../../logic/dates";
import {useStore} from "../../store/PrototypeStore";
import {useTheme} from "../../theme/ThemeProvider";
import {ConnectIcon} from "../../ui/Logo";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import {EventImage} from "../../ui/Media";
import {EmptyState} from "../../ui/States";
import Text from "../../ui/Text";

function FloatingButton({label, onPress, children}: {label: string; onPress: () => void; children: ReactNode}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={2}
               style={{width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center"}}>
      {children}
    </Pressable>
  );
}

function InfoRow({icon, title, subtitle, action}: {icon: ReactNode; title: string; subtitle: string; action?: ReactNode}) {
  const theme = useTheme();
  return (
    <View style={{flexDirection: "row", alignItems: "center", gap: theme.space.lg}}>
      {icon}
      <View style={{flex: 1, gap: 1}}>
        <Text weight={600}>{title}</Text>
        <Text variant="meta" color={theme.color.muted}>{subtitle}</Text>
      </View>
      {action}
    </View>
  );
}

function IconTile({children}: {children: ReactNode}) {
  const theme = useTheme();
  return (
    <View style={{width: 40, height: 40, borderRadius: theme.radius.thumb, backgroundColor: theme.color.accentSoft, alignItems: "center", justifyContent: "center"}}>
      {children}
    </View>
  );
}

export default function EventDetailScreen({navigation, route}: RootScreenProps<"EventDetail">) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {saved, toggleSaved, going, toggleGoing, showToast} = useStore();
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(false);
  const event = getEvent(route.params.id);

  if (!event) {
    return (
      <View style={{flex: 1, paddingTop: insets.top + 40}}>
        <EmptyState title="Evenimentul nu mai există" message="Poate a fost anulat sau mutat." action="Înapoi" onAction={() => navigation.goBack()}/>
      </View>
    );
  }

  const isGoing = going.has(event.id);
  const isSaved = saved.has(event.id);
  // event.going already counts the current user for events they were going to initially
  const wasGoing = (currentUser.goingTo ?? []).includes(event.id);
  const goingCount = event.going + (isGoing ? 1 : 0) - (wasGoing ? 1 : 0);
  const attendees = people.filter((p) => (p.goingTo ?? []).includes(event.id)).slice(0, 3);
  const moreCompatible = Math.max(0, event.compatible - attendees.length);
  const iconProps = {size: theme.icon.sm, color: theme.color.accentText, strokeWidth: theme.icon.stroke};
  const organizer = event.organizer ?? {name: event.venue, verified: false};
  const initials = organizer.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <View style={{flex: 1, backgroundColor: theme.color.bg}}>
      <ScrollView contentContainerStyle={{paddingBottom: 120 + insets.bottom}}>
        <View style={{height: 300}}>
          <EventImage eventId={event.id} width="100%" height={300}/>
          <View style={{position: "absolute", top: insets.top + theme.space.sm, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between"}}>
            <FloatingButton label="Înapoi" onPress={() => navigation.goBack()}>
              <ChevronLeft size={theme.icon.md} color={theme.color.ink} strokeWidth={theme.icon.strokeActive}/>
            </FloatingButton>
            <View style={{flexDirection: "row", gap: theme.space.sm}}>
              <FloatingButton label="Distribuie" onPress={() => Share.share({message: `${event.title} – ${formatLongDate(event.startsAt)}, ${event.venue}`})}>
                <Share2 size={theme.icon.sm} color={theme.color.ink} strokeWidth={theme.icon.stroke}/>
              </FloatingButton>
              <FloatingButton label={isSaved ? "Elimină din salvate" : "Salvează"} onPress={() => toggleSaved(event.id)}>
                <Bookmark size={theme.icon.sm} strokeWidth={theme.icon.stroke}
                          color={isSaved ? theme.color.accentText : theme.color.ink} fill={isSaved ? theme.color.accentText : "none"}/>
              </FloatingButton>
            </View>
          </View>
        </View>

        <View style={{marginTop: -20, backgroundColor: theme.color.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingTop: 22, paddingHorizontal: theme.space.screenX, gap: theme.space["2xl"]}}>
          <View style={{gap: theme.space.sm}}>
            <Text variant="meta" weight={600} color={theme.color.accentText}>
              {[CATEGORY_LABEL[event.category], ...(event.tags ?? [])].join(" · ")}
            </Text>
            <Text variant="page" accessibilityRole="header">{event.title}</Text>
          </View>

          <View style={{gap: theme.space.xl}}>
            <InfoRow icon={<IconTile><Calendar {...iconProps}/></IconTile>} title={formatLongDate(event.startsAt)} subtitle={formatTimeRange(event.startsAt, event.endsAt)}/>
            <InfoRow
              icon={<IconTile><MapPin {...iconProps}/></IconTile>}
              title={event.venue}
              subtitle={`${venueAddress}, ${CITY}`}
              action={
                <Pressable accessibilityRole="link" onPress={() => showToast("Harta vine în curând")} style={{paddingVertical: theme.space.lg, paddingLeft: theme.space.sm}}>
                  <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>Hartă</Text>
                </Pressable>
              }
            />
            {event.priceFrom !== undefined && (
              <InfoRow icon={<IconTile><Ticket {...iconProps}/></IconTile>} title={`de la ${event.priceFrom} lei`} subtitle="Bilete pe site-ul organizatorului"/>
            )}
            <InfoRow
              icon={
                <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: theme.color.surfaceMuted, alignItems: "center", justifyContent: "center"}}>
                  <Text weight={700} variant="meta">{initials}</Text>
                </View>
              }
              title={organizer.name}
              subtitle={organizer.verified ? "Organizator verificat" : "Organizator"}
              action={<Button title={following ? "Urmărești" : "Urmărește"} variant="outline" size="sm" onPress={() => setFollowing((f) => !f)}/>}
            />
          </View>

          <View accessibilityLabel="Cine merge" style={{borderRadius: theme.radius.cardLg, backgroundColor: theme.color.tintCard, borderWidth: 1, borderColor: theme.color.tintCardBorder, padding: 16, gap: theme.space.xl}}>
            <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "space-between"}}>
              <Text weight={700} style={{fontSize: theme.fontSize.button}}>Cine merge</Text>
              <Text variant="meta" color={theme.color.muted}>{goingCount} persoane</Text>
            </View>
            <View style={{flexDirection: "row", gap: theme.space.lg}}>
              {attendees.map((p) => (
                <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Profilul lui ${p.firstName}`}
                           onPress={() => navigation.navigate("ProfileView", {id: p.id, eventId: event.id})}
                           style={{width: 60, alignItems: "center", gap: theme.space.xs}}>
                  <Avatar name={p.firstName} personId={p.id} size={52}/>
                  <Text variant="meta" weight={500}>{p.firstName}</Text>
                </Pressable>
              ))}
              {moreCompatible > 0 && (
                <View style={{width: 60, alignItems: "center", gap: theme.space.xs}}>
                  <View style={{width: 52, height: 52, borderRadius: 26, backgroundColor: theme.color.bg, borderWidth: 1, borderColor: theme.color.tintCardBorder, alignItems: "center", justifyContent: "center"}}>
                    <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>+{moreCompatible}</Text>
                  </View>
                  <Text variant="meta" color={theme.color.muted}>compatibili</Text>
                </View>
              )}
            </View>
            <Button
              title="Cunoaște-i în Connect"
              variant="accentOutline"
              size="md"
              icon={<ConnectIcon size={18} color={theme.color.accentText} strokeWidth={1.8}/>}
              onPress={() => navigation.navigate("Tabs", {screen: "Connect", params: {eventId: event.id}})}
              style={{height: 42, borderRadius: 21}}
            />
          </View>

          <View style={{gap: theme.space.xs}}>
            <Text weight={700} style={{fontSize: theme.fontSize.button}}>Despre</Text>
            <Text color={theme.color.inkBody} numberOfLines={expanded ? undefined : 3} style={{lineHeight: 22}}>{eventDescription}</Text>
            <Pressable accessibilityRole="button" onPress={() => setExpanded((e) => !e)} style={{alignSelf: "flex-start", paddingVertical: theme.space.sm}}>
              <Text weight={600} color={theme.color.accentText} style={{fontSize: theme.fontSize.label}}>{expanded ? "Citește mai puțin" : "Citește mai mult"}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={{position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: theme.space.lg, paddingHorizontal: theme.space.screenX, paddingBottom: Math.max(insets.bottom, theme.space.lg), backgroundColor: theme.color.bg, borderTopWidth: 1, borderTopColor: theme.color.border, flexDirection: "row", gap: theme.space.md}}>
        <Button title="Bilete" variant="outline" size="md" onPress={() => showToast("Te ducem pe site-ul organizatorului")}/>
        <Button
          title={isGoing ? "Merg" : "Merg și eu"}
          variant={isGoing ? "accentOutline" : "primary"}
          size="md"
          accessibilityLabel={isGoing ? "Merg, apasă ca să anulezi" : "Merg și eu"}
          icon={isGoing ? <Check size={18} color={theme.color.accentText} strokeWidth={2.2}/> : undefined}
          onPress={() => {
            toggleGoing(event.id);
            if (!isGoing) showToast("Super! Acum apari în Connect pentru acest eveniment");
          }}
          style={{flex: 1, borderColor: theme.color.accentFill}}
        />
      </View>
    </View>
  );
}
