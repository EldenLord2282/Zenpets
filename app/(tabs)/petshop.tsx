import { Image } from 'expo-image';
import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
    Pressable,
    Modal,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Pet = {
    id: number;
    name: string;
    emoji: string;
    rarity: 'Common' | 'Rare' | 'Epic';
    price: number;
};

const PETS: Pet[] = [
    { id: 1, name: 'Dog', emoji: '🐶', rarity: 'Common', price: 250 },
    { id: 2, name: 'Cat', emoji: '🐱', rarity: 'Common', price: 250 },
    { id: 3, name: 'Rabbit', emoji: '🐰', rarity: 'Rare', price: 500 },
    { id: 4, name: 'Parrot', emoji: '🦜', rarity: 'Rare', price: 500 },
    { id: 5, name: 'Fox', emoji: '🦊', rarity: 'Epic', price: 900 },
    { id: 6, name: 'Panda', emoji: '🐼', rarity: 'Epic', price: 900 },
    { id: 7, name: 'Tiger', emoji: '🐯', rarity: 'Epic', price: 1200 },
    { id: 8, name: 'Wolf', emoji: '🐺', rarity: 'Epic', price: 1200 },
];

export default function PetShopScreen() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [previewPet, setPreviewPet] = useState<Pet | null>(null);
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);


    return (
        <View style={styles.container}>
            {/* Background */}
            <LinearGradient
                colors={['#EAF4FF', '#FDFEFF']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <ThemedText type="title" style={styles.title}>
                Pet Shop 🐾
            </ThemedText>

            {/* Store Grid */}
            <Animated.ScrollView
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {PETS.map((pet, index) => {
                    const isEpic = pet.rarity === 'Epic';
                    const glowBorderColor = glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.9)'], // gold glow
                    });

                    const glowShadow = glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [6, 14],
                    });

                    const rowIndex = Math.floor(index / 2);
                    const inputRange = [
                        (rowIndex - 1) * 200,
                        rowIndex * 200,
                        (rowIndex + 1) * 200,
                    ];

                    const translateY = scrollY.interpolate({
                        inputRange,
                        outputRange: [8, 0, 8],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={pet.id}
                            style={[
                                styles.card,
                                { width: CARD_WIDTH, transform: [{ translateY }] },

                                isEpic && {
                                    borderWidth: 2,
                                    borderColor: glowBorderColor,
                                    shadowColor: '#FFD700',
                                    shadowOpacity: 0.8,
                                    shadowRadius: glowShadow,
                                    elevation: 12,
                                },
                            ]}
                        >
                            {/* Emoji */}
                            <Text style={styles.petEmoji}>{pet.emoji}</Text>

                            {/* Info */}
                            <Text style={styles.petName}>{pet.name}</Text>
                            <Text style={styles.petRarity}>{pet.rarity}</Text>

                            {/* Bottom Row */}
                            <View style={styles.bottomRow}>
                                <Text style={styles.petPrice}>₹ {pet.price}</Text>

                                <Pressable
                                    style={styles.previewBtn}
                                    onPress={() => setPreviewPet(pet)}
                                >
                                    <Text style={styles.previewText}>Preview</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    );
                })}
            </Animated.ScrollView>

            {/* Preview Modal */}
            <Modal transparent visible={!!previewPet} animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setPreviewPet(null)}
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalEmoji}>{previewPet?.emoji}</Text>
                        <Text style={styles.modalName}>{previewPet?.name}</Text>

                        <Pressable style={styles.buyBtn}>
                            <Text style={styles.buyText}>Buy</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    title: {
        marginTop: 60,
        marginBottom: 20,
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: '800',
        color: '#1F3C88',
    },

    grid: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    card: {
        height: 190,
        marginBottom: 20,
        borderRadius: 24,
        backgroundColor: '#fff',
        padding: 14,
        alignItems: 'center',

        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
    },

    petEmoji: {
        fontSize: 44,
        marginTop: 6,
    },

    petName: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    petRarity: {
        fontSize: 12,
        color: '#6C63FF',
        marginBottom: 8,
    },

    bottomRow: {
        marginTop: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    petPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    previewBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#6C63FF',
    },

    previewText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: 240,
        borderRadius: 24,
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
    },

    modalEmoji: {
        fontSize: 60,
    },

    modalName: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
    },

    buyBtn: {
        marginTop: 14,
        width: '100%',
        height: 42,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

