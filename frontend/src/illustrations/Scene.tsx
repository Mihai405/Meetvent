// Placeholder illustration per event type (design-source/Scene.dc.html).
// Used when an event has no photo.
import type {ReactElement} from "react";
import Svg, {Circle, Ellipse, G, Path, Rect} from "react-native-svg";

export type SceneKind = "concert" | "football" | "gallery" | "comedy" | "film" | "tech" | "jazz" | "photo";

const CROWD_X = [10, 32, 54, 76, 98, 120, 142, 164, 186, 208, 230];
const CROWD_Y = [134, 130, 135, 129, 134, 128, 133, 129, 134, 130, 134];

function Concert() {
  return (
    <>
      <Rect width={240} height={150} fill="#2A1735"/>
      <Path d="M50 -5 L5 150 H95Z" fill="#FF6B2C" opacity={0.5}/>
      <Path d="M190 -5 L145 150 H235Z" fill="#FFC44D" opacity={0.4}/>
      <Path d="M120 -5 L88 150 H152Z" fill="#FF5C8A" opacity={0.38}/>
      {[50, 120, 190].map((cx) => <Circle key={cx} cx={cx} cy={0} r={9} fill="#FFD3B5"/>)}
      <G fill="#130A19">
        <Rect x={0} y={134} width={240} height={16}/>
        {CROWD_X.map((cx, i) => <Circle key={cx} cx={cx} cy={CROWD_Y[i]} r={10}/>)}
        <Path d="M70 126 L62 102 L69 100 L78 124Z"/>
        <Path d="M168 124 L176 98 L183 100 L175 126Z"/>
        <Path d="M118 122 L114 96 L121 95 L124 121Z"/>
      </G>
    </>
  );
}

function Football() {
  return (
    <>
      <Rect width={240} height={150} fill="#2E8A4E"/>
      {[0, 60, 120, 180].map((x) => <Rect key={x} x={x} width={30} height={150} fill="#287D45"/>)}
      <G fill="none" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={2.5}>
        <Rect x={8} y={8} width={224} height={134}/>
        <Path d="M120 8V142"/>
        <Circle cx={120} cy={75} r={26}/>
        <Rect x={8} y={45} width={30} height={60}/>
        <Rect x={202} y={45} width={30} height={60}/>
      </G>
      <Circle cx={150} cy={98} r={7} fill="#FFFFFF"/>
      <Rect x={0} y={0} width={240} height={6} fill="#1E1612"/>
      <Rect x={0} y={0} width={120} height={6} fill="#FF6B2C"/>
    </>
  );
}

function Gallery() {
  return (
    <>
      <Rect width={240} height={150} fill="#F6E4D2"/>
      <Rect y={116} width={240} height={34} fill="#E2C7AC"/>
      <Rect x={26} y={28} width={58} height={72} fill="#FF6B2C" stroke="#1E1612" strokeWidth={4}/>
      <Circle cx={55} cy={56} r={14} fill="#FFC44D"/>
      <Rect x={104} y={40} width={40} height={50} fill="#2F4858" stroke="#1E1612" strokeWidth={4}/>
      <Rect x={164} y={24} width={50} height={78} fill="#FF5C8A" stroke="#1E1612" strokeWidth={4}/>
      <Path d="M166 100 L184 62 L198 82 L212 68 V100Z" fill="#7A2E4A"/>
    </>
  );
}

function Comedy() {
  return (
    <>
      <Rect width={240} height={150} fill="#3B1E2C"/>
      <Path d="M120 -10 L56 150 H184Z" fill="#FFD9A0" opacity={0.22}/>
      <Ellipse cx={120} cy={140} rx={62} ry={10} fill="#FFD9A0" opacity={0.3}/>
      <Rect x={117} y={70} width={6} height={68} fill="#1E1612"/>
      <Rect x={102} y={134} width={36} height={6} rx={3} fill="#1E1612"/>
      <Rect x={110} y={44} width={20} height={32} rx={10} fill="#FF6B2C"/>
      <Circle cx={40} cy={30} r={3} fill="#FFD9A0"/>
      <Circle cx={200} cy={22} r={3} fill="#FFD9A0"/>
      <Circle cx={214} cy={60} r={2} fill="#FFD9A0"/>
    </>
  );
}

function Film() {
  return (
    <>
      <Rect width={240} height={150} fill="#1E2740"/>
      <Rect x={30} y={16} width={180} height={80} rx={4} fill="#FFE1C7"/>
      <Path d="M30 96 L96 46 L138 76 L168 56 L210 96Z" fill="#FF8A4C"/>
      <Circle cx={176} cy={38} r={10} fill="#FFC44D"/>
      <G fill="#121829">
        <Rect x={0} y={126} width={240} height={24}/>
        {[[20, 124], [48, 126], [76, 123], [104, 126], [132, 124], [160, 126], [188, 123], [216, 126]].map(([cx, cy]) => (
          <Circle key={cx} cx={cx} cy={cy} r={11}/>
        ))}
      </G>
    </>
  );
}

function Tech() {
  const dots = [[20, 20], [50, 20], [190, 20], [220, 20], [20, 50], [220, 50], [20, 80], [220, 80], [20, 110], [220, 110]];
  return (
    <>
      <Rect width={240} height={150} fill="#FFE8D6"/>
      <G fill="#F7C6A2">{dots.map(([cx, cy]) => <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3}/>)}</G>
      <Rect x={70} y={34} width={100} height={66} rx={6} fill="#1E1612"/>
      <Rect x={76} y={40} width={88} height={54} rx={2} fill="#FF6B2C"/>
      <Path d="M90 58h30M90 68h50M90 78h22" stroke="#1E1612" strokeWidth={4} strokeLinecap="round"/>
      <Path d="M54 102 H186 L176 114 H64Z" fill="#3A2E28"/>
    </>
  );
}

function Jazz() {
  return (
    <>
      <Rect width={240} height={150} fill="#2D2452"/>
      <Circle cx={186} cy={38} r={18} fill="#FFE3B0"/>
      <Circle cx={40} cy={24} r={2} fill="#FFE3B0"/>
      <Circle cx={80} cy={40} r={1.5} fill="#FFE3B0"/>
      <Circle cx={130} cy={18} r={2} fill="#FFE3B0"/>
      <Path d="M0 150 V100 H24 V84 H44 V106 H64 V76 H88 V98 H108 V88 H132 V110 H150 V80 H174 V100 H196 V90 H216 V104 H240 V150Z" fill="#17122E"/>
      <G fill="#FF8A3D">
        {[[70, 84], [78, 92], [156, 88], [164, 96], [30, 92]].map(([x, y]) => <Rect key={`${x}-${y}`} x={x} y={y} width={4} height={4}/>)}
      </G>
    </>
  );
}

function Photo() {
  return (
    <>
      <Rect width={240} height={150} fill="#2F4858"/>
      <Rect x={72} y={48} width={96} height={64} rx={10} fill="#FFE8D6"/>
      <Rect x={96} y={38} width={30} height={14} rx={4} fill="#FFE8D6"/>
      <Circle cx={120} cy={80} r={21} fill="#1E1612"/>
      <Circle cx={120} cy={80} r={11} fill="#FF6B2C"/>
      <Circle cx={154} cy={60} r={4} fill="#FF6B2C"/>
    </>
  );
}

const SCENES: Record<SceneKind, () => ReactElement> = {
  concert: Concert, football: Football, gallery: Gallery, comedy: Comedy, film: Film, tech: Tech, jazz: Jazz, photo: Photo,
};

export default function Scene({kind}: {kind: SceneKind}) {
  const Content = SCENES[kind] ?? Concert;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" accessibilityElementsHidden>
      <Content/>
    </Svg>
  );
}
