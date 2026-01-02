import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD = (width - 56) / 2;

const DOG_NAMES = [
    'Buddy', 'Max', 'Milo', 'Rocky', 'Charlie', 'Toby', 'Leo', 'Oscar',
    'Bruno', 'Jack', 'Finn', 'Rusty', 'Ollie', 'Benny', 'Louie', 'Teddy',
    'Ranger', 'Shadow', 'Hunter', 'Blaze', 'Scout', 'Dash', 'Ace', 'Bolt',
    'Ghost', 'Storm', 'Flash', 'Arrow', 'Fang', 'Wolf', 'Nitro', 'Comet',
    'Titan', 'Odin', 'Rex', 'Atlas', 'Zeus', 'Thor', 'Nova', 'Draco',
    'Phantom', 'Inferno', 'Eclipse', 'Vortex', 'Ember', 'Frost', 'Onyx', 'Legend'
];

const DOG_SPRITE = {
    frameWidth: 16,
    frameHeight: 16,
    columns: 16,
};
const SKINS = DOG_NAMES.map((name, index) => ({
    id: index.toString(),
    frameIndex: index,
    name,
    owned: index % 6 === 0, // demo ownership
}));

function SpriteFrame({ frame, scale = 4 }: { frame: number; scale?: number }) {
  const FRAME = 16;
  const COLUMNS = 16;

  const x = (frame % COLUMNS) * FRAME;
  const y = Math.floor(frame / COLUMNS) * FRAME;

  return (
    <View
      style={{
        width: FRAME * scale,
        height: FRAME * scale,
        overflow: 'hidden',
      }}
    >
    </View>
  );
}



export default function SkinShopScreen() {
    return (
        <LinearGradient
            colors={['#FFF4C2', '#F1C86A', '#E1A83A']}
            style={styles.container}
        >
            {/* Soft vignette */}
            <LinearGradient
                colors={['rgba(0,0,0,0.05)', 'transparent']}
                style={StyleSheet.absoluteFill}
            />

            <FlatList
                data={SKINS}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SkinCard skin={item} />}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
        </LinearGradient>
    );
}
function SkinCard({ skin }: any) {
    return (
        <View style={styles.cardWrap}>
            <View style={styles.card}>
                {/* Character */}
                <View style={styles.spriteStage}>
                    <SpriteFrame frame={skin.frameIndex} scale={3.8} />
                </View>

                {/* Name */}
                <Text style={styles.name}>{skin.name}</Text>

                {/* Action */}
                {skin.owned ? (
                    <Pressable style={styles.previewBtn}>
                        <Text style={styles.previewText}>Preview</Text>
                    </Pressable>
                ) : (
                    <Pressable style={styles.buyBtn}>
                        <Text style={styles.buyText}>Buy</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    grid: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },

    /* CARD */
    cardWrap: {
        width: CARD,
        margin: 8,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },

    /* ART STAGE */
    spriteStage: {
        width: 88,
        height: 88,
        borderRadius: 18,
        backgroundColor: '#FFF1C1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E3B25F',
        shadowColor: '#D9A441',
        shadowOpacity: 0.5,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    art: {
        width: 80,
        height: 80,
    },

    /* TEXT */
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2E2E2E',
        marginBottom: 6,
    },

    /* BUTTONS */
    buyBtn: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#3CCF4E',
        alignItems: 'center',
    },
    buyText: {
        color: '#FFF',
        fontWeight: '900',
    },

    previewBtn: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#ECECEC',
        alignItems: 'center',
    },
    previewText: {
        color: '#555',
        fontWeight: '800',
    },
});
