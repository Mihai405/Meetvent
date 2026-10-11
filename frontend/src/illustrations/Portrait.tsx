// Placeholder portrait of an invented person (design-source/Portrait.dc.html).
// Replaced by the user's real photo once photos exist.
import Svg, {Circle, Ellipse, G, Path, Rect} from "react-native-svg";

type Person = {
  name: string; skin: string; hair: string; long: boolean; top: keyof typeof TOPS;
  beard?: boolean; glasses?: boolean; shirt: string; bg: string; deco: string; bg2: string; deco2: string;
};

const PEOPLE: Record<string, Person> = {
  ioana: {name: "Ioana", skin: "#F1C7A5", hair: "#3A2318", long: true, top: "side", shirt: "#2F4858", bg: "#FFD9C2", deco: "#FFC2A0", bg2: "#FF9A62", deco2: "#FFB68C"},
  radu: {name: "Radu", skin: "#D69E78", hair: "#2B1B12", long: false, top: "short", beard: true, shirt: "#FF8A3D", bg: "#FFE6A6", deco: "#FFD56E", bg2: "#2F4858", deco2: "#3D5A6C"},
  maria: {name: "Maria", skin: "#F6D2B8", hair: "#B4542A", long: true, top: "side", shirt: "#5A3B7B", bg: "#FFCFC8", deco: "#FFB1A6", bg2: "#FFE0A8", deco2: "#FFCB70"},
  alex: {name: "Alex", skin: "#8A5A3C", hair: "#1B1210", long: false, top: "curly", glasses: true, shirt: "#F2B33D", bg: "#D3E6DA", deco: "#B6D8C3", bg2: "#FFD2B8", deco2: "#FFB78F"},
  bianca: {name: "Bianca", skin: "#E9BD98", hair: "#6A4126", long: true, top: "side", shirt: "#2E6F73", bg: "#E7D8FF", deco: "#D3BEFF", bg2: "#FFD9C2", deco2: "#FFC2A0"},
  ana: {name: "Ana", skin: "#F3CCAE", hair: "#C25B2A", long: true, top: "side", shirt: "#1E1612", bg: "#FFD0B5", deco: "#FFB088", bg2: "#FFE6A6", deco2: "#FFD56E"},
  cristi: {name: "Cristi", skin: "#E2B08C", hair: "#5B3A24", long: false, top: "short", glasses: true, shirt: "#3E5BA9", bg: "#CFE0FF", deco: "#B3CBFF", bg2: "#FFE6A6", deco2: "#FFD56E"},
};

const TOPS = {
  side: "M58 100C52 56 84 44 102 44S150 58 142 102C132 76 112 66 96 70C84 74 70 84 58 100Z",
  short: "M60 92C58 58 84 46 100 46S142 58 140 92C130 78 116 72 100 72S70 78 60 92Z",
  curly: "M56 96C44 58 70 36 100 38S156 58 144 96C136 80 118 74 100 74S64 80 56 96Z",
};

function shade(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return "rgb(" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c * 0.88)).join(",") + ")";
}

export type PortraitWho = keyof typeof PEOPLE;

type Props = {who: string; variant?: "a" | "b"; crop?: "full" | "face"};

export default function Portrait({who, variant = "a", crop = "full"}: Props) {
  const q = PEOPLE[who] ?? PEOPLE.ioana;
  const b = variant === "b";
  const bg = b ? q.bg2 : q.bg;
  const deco = b ? q.deco2 : q.deco;
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={crop === "face" ? "46 44 108 108" : "0 0 200 240"}
      preserveAspectRatio="xMidYMid slice"
      accessibilityLabel={`Portret ilustrat: ${q.name}`}
    >
      <Rect x={-200} y={-200} width={600} height={640} fill={bg}/>
      <Circle cx={164} cy={44} r={48} fill={deco}/>
      <Circle cx={28} cy={190} r={30} fill={deco}/>
      {q.long && <Path d="M52 104C48 50 152 50 148 104L156 206C128 218 72 218 44 206Z" fill={q.hair}/>}
      <Path d="M16 240C16 188 58 164 100 164S184 188 184 240Z" fill={q.shirt}/>
      <Rect x={87} y={128} width={26} height={48} rx={12} fill={shade(q.skin)}/>
      <Ellipse cx={100} cy={100} rx={40} ry={47} fill={q.skin}/>
      {q.beard && <Path d="M66 112C70 146 88 152 100 152S130 146 134 112C126 130 114 134 100 134S74 130 66 112Z" fill={q.hair}/>}
      <Path d={TOPS[q.top]} fill={q.hair}/>
      <Ellipse cx={77} cy={119} rx={7} ry={4} fill="#FF7A5C" opacity={0.28}/>
      <Ellipse cx={123} cy={119} rx={7} ry={4} fill="#FF7A5C" opacity={0.28}/>
      <Circle cx={86} cy={104} r={4} fill="#1E1612"/>
      <Circle cx={114} cy={104} r={4} fill="#1E1612"/>
      {q.glasses && (
        <G fill="none" stroke="#1E1612" strokeWidth={3}>
          <Circle cx={86} cy={104} r={11}/>
          <Circle cx={114} cy={104} r={11}/>
          <Path d="M97 104h6"/>
        </G>
      )}
      <Path d="M88 124Q100 134 112 124" fill="none" stroke="#1E1612" strokeWidth={3.5} strokeLinecap="round"/>
    </Svg>
  );
}
