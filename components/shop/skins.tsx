import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Pressable,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { DOG_SKINS } from '@/assets/images/Pixel Dogs-Sprites';
import { Image as RNImage } from 'react-native';

const { width } = Dimensions.get('window');
const CARD = (width - 56) / 2;



type SpriteProps = {
    source: any;
    frameWidth: number;
    frameHeight: number;
    columns: number;
    totalRows: number;
    rowsToPlay: number;
    yOffset?: number;
    fps?: number;
};

/* 🐕 Sprite sheet config */
const DOG_SPRITE = {
    frameWidth: 64,
    frameHeight: 54,
    columns: 8,
    totalRows: 8,
    rowsToPlay: 4,
    yOffset: 4,
};

/* 🐾 Names */
const DOG_NAMES = [
    'Buddy', 'Max', 'Milo', 'Rocky', 'Charlie', 'Toby', 'Leo', 'Oscar',
    'Bruno', 'Jack', 'Finn', 'Rusty', 'Ollie', 'Benny', 'Louie', 'Teddy',
    'Ranger', 'Shadow', 'Hunter', 'Blaze', 'Scout'
];

/* 🛍 Shop data */
const SKINS = DOG_NAMES.map((name, index) => ({
    id: index.toString(),
    name,
    image: DOG_SKINS[index],
    owned: index % 5 === 0,
}));

/* 🎞 Sprite Animator */
function SpriteAnimator({
    source,
    frameWidth,
    frameHeight,
    columns,
    totalRows,
    rowsToPlay,
    yOffset = 0,
    fps = 10,
}: SpriteProps) {

    const FRAME_WIDTH = frameWidth;
    const FRAME_HEIGHT = frameHeight;
    const COLUMNS = columns;
    const TOTAL_ROWS = totalRows;
    const ROWS_TO_PLAY = rowsToPlay;
    const FPS = fps;

    const x = useRef(new Animated.Value(0)).current;
    const y = useRef(new Animated.Value(0)).current;
    const Y_OFFSET = 4;
    const frame = useRef(0);
    const row = useRef(0);

    useEffect(() => {
        let last = 0;
        let raf: number;

        row.current = rowsToPlay - 1; // ✅ FIXED ROW (0-based)

        const loop = (t: number) => {
            if (t - last >= 1000 / FPS) {
                last = t;

                frame.current = (frame.current + 1) % COLUMNS;

                x.setValue(-frame.current * FRAME_WIDTH);
                y.setValue(-row.current * FRAME_HEIGHT);
            }

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [rowsToPlay, FPS]);

    return (
        <View
            style={{
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                overflow: 'hidden',
            }}
        >
            <Animated.View
                style={{
                    width: FRAME_WIDTH * COLUMNS,
                    height: FRAME_HEIGHT * TOTAL_ROWS, // ✅ FULL HEIGHT
                    transform: [
                        { translateX: x },
                        { translateY: Animated.add(y, new Animated.Value(Y_OFFSET)) },
                    ],
                }}
            >
                <RNImage
                    source={source}
                    style={{
                        width: FRAME_WIDTH * COLUMNS,
                        height: FRAME_HEIGHT * TOTAL_ROWS,

                    }}
                />
            </Animated.View>
        </View>
    );
}



/* 🛍 Screen */
export default function SkinShopScreen() {
    return (
        <LinearGradient
            colors={['#FFF4C2', '#F1C86A', '#E1A83A']}
            style={styles.container}
        >
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

/* 🐕 Card */
function SkinCard({ skin }: any) {
    return (
        <View style={styles.cardWrap}>
            <View style={styles.card}>
                <View style={styles.spriteStage}>
                    <SpriteAnimator {...DOG_SPRITE} source={skin.image} />
                </View>


                <Text style={styles.name}>{skin.name}</Text>

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

/* 🎨 Styles */
const styles = StyleSheet.create({
    container: { flex: 1 },

    grid: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },

    cardWrap: {
        width: CARD,
        margin: 8,
    },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        elevation: 6,
    },

    spriteStage: {
        width: 110,
        height: 100,
        borderRadius: 18,
        backgroundColor: '#FFF1C1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E3B25F',
    },

    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2E2E2E',
        marginVertical: 8,
    },

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
