import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ImageBackground,
    LayoutAnimation,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ================= TYPES ================= */

type DayEntry = {
  day: number;
  date: string;
};

type StreakItem = {
  title: string;
  days: DayEntry[];
  targetDays?: number;
};

/* ================= COMPONENT ================= */

export default function Streak() {
  const [streaks, setStreaks] = useState<StreakItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [streakName, setStreakName] = useState("");
  const [targetDays, setTargetDays] = useState("");

  /* ================= HELPERS ================= */

  const getTodayDate = () =>
    new Date().toLocaleDateString("en-GB");

  const getMotivationText = (current: number, target?: number) => {
    if (!target) return null;

    const remaining = target - current;

    if (remaining <= 0)
      return "🎉 Target completed! Amazing discipline!";
    if (remaining === 1)
      return "🔥 Just 1 day left — finish strong!";
    if (remaining <= 3)
      return "💪 Almost there, don’t stop now!";
    if (remaining <= 7)
      return "✨ You’re getting close, keep pushing!";
    return null;
  };

  /* ================= ACTIONS ================= */

  const toggle = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setOpenIndex(openIndex === index ? null : index);
  };

  const createStreak = () => {
    if (!streakName.trim()) return;

    setStreaks((prev) => [
      ...prev,
      {
        title: streakName.trim(),
        days: [],
        targetDays: targetDays ? Number(targetDays) : undefined,
      },
    ]);

    setStreakName("");
    setTargetDays("");
    setModalVisible(false);
  };

  const deleteStreak = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setStreaks((prev) => prev.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  const addDayToStreak = (index: number) => {
    LayoutAnimation.easeInEaseOut();

    setStreaks((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              days: [
                ...item.days,
                {
                  day: item.days.length + 1,
                  date: getTodayDate(),
                },
              ],
            }
          : item
      )
    );
  };

  const deleteLastDay = (index: number) => {
    LayoutAnimation.easeInEaseOut();

    setStreaks((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, days: item.days.slice(0, -1) }
          : item
      )
    );
  };

  /* ================= UI ================= */

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>⚡ Streak</Text>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>＋ Create</Text>
        </TouchableOpacity>

        {/* Card */}
        <View style={styles.card}>
          {streaks.length === 0 ? (
            <Text style={styles.emptyText}>
              No streaks yet. Create one.
            </Text>
          ) : (
            streaks.map((item, index) => {
              const motivation = getMotivationText(
                item.days.length,
                item.targetDays
              );

              return (
                <View key={index} style={styles.section}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggle(index)}
                  >
                    <Text style={styles.sectionTitle}>
                      {item.title}
                    </Text>

                    <View style={styles.icons}>
                      <TouchableOpacity
                        onPress={() => deleteStreak(index)}
                      >
                        <Feather
                          name="trash-2"
                          size={16}
                          color="#d11a2a"
                        />
                      </TouchableOpacity>
                      <Feather
                        name={
                          openIndex === index
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={18}
                        color="#555"
                      />
                    </View>
                  </TouchableOpacity>

                  {openIndex === index && (
                    <View style={styles.daysContainer}>
                      {/* Counter */}
                      <View style={styles.counterRow}>
                        <Text style={styles.counterText}>
                          🔥 {item.days.length}
                          {item.targetDays
                            ? ` / ${item.targetDays}`
                            : ""}{" "}
                          Days
                        </Text>

                        <TouchableOpacity
                          style={styles.addDayBtn}
                          onPress={() =>
                            addDayToStreak(index)
                          }
                        >
                          <Text style={styles.addDayText}>
                            ＋
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Motivation */}
                      {motivation && (
                        <Text style={styles.motivationText}>
                          {motivation}
                        </Text>
                      )}

                      {/* Days */}
                      {item.days.length === 0 ? (
                        <Text style={styles.dayTextMuted}>
                          No days added yet
                        </Text>
                      ) : (
                        item.days.map((d, i) => {
                          const isLast =
                            i === item.days.length - 1;

                          return (
                            <View
                              key={i}
                              style={styles.dayRow}
                            >
                              <View>
                                <Text
                                  style={styles.dayLabel}
                                >
                                  Day {d.day}
                                </Text>
                                <Text
                                  style={styles.dayDate}
                                >
                                  {d.date}
                                </Text>
                              </View>

                              {isLast && (
                                <TouchableOpacity
                                  onPress={() =>
                                    deleteLastDay(index)
                                  }
                                >
                                  <Text
                                    style={styles.deleteIcon}
                                  >
                                    🗑️
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* CREATE MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              New Streak 🔥
            </Text>

            <TextInput
              placeholder="Streak name"
              value={streakName}
              onChangeText={setStreakName}
              style={styles.input}
            />

            <TextInput
              placeholder="Target days (optional)"
              value={targetDays}
              onChangeText={setTargetDays}
              keyboardType="number-pad"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={createStreak}>
                <Text style={styles.create}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
     bg: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
  container: {
    padding: 20,
    flexGrow: 1,
  },

  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },

  addBtn: {
    alignSelf: "center",
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginBottom: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 16,
    padding: 12,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 20,
  },

  section: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#e9eef3",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
  },

  icons: {
    flexDirection: "row",
    gap: 12,
  },

  daysContainer: {
    padding: 14,
    backgroundColor: "#f9fafb",
  },

  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  counterText: {
    fontSize: 14,
    fontWeight: "600",
  },

  addDayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4caf50",
    alignItems: "center",
    justifyContent: "center",
  },

  addDayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  motivationText: {
    fontSize: 13,
    color: "#4caf50",
    marginBottom: 8,
    fontWeight: "500",
  },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  dayLabel: {
    fontSize: 13,
    color: "#333",
  },

  dayDate: {
    fontSize: 12,
    color: "#777",
  },

  dayTextMuted: {
    fontSize: 13,
    color: "#888",
  },

  deleteIcon: {
    fontSize: 16,
    padding: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },

  cancel: {
    color: "#777",
  },

  create: {
    color: "#4caf50",
    fontWeight: "600",
  },
});
