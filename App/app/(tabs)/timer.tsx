// Dakota Strand - Timer Screen Component
// Allows user to set, extend, and cancel safety timers

import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useTimer } from "../../hooks/useTimer";

export default function TimerScreen(props: any) {
  const { timer, startTimer, extendTimer, cancelTimer } = useTimer();
  const [duration] = useState<number>(5); // Default timer: 5 minutes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Timer</Text>

      {/* Show active timer */}
      {timer ? (
        <View>
          <Text>Timer set for {timer} minutes</Text>
          <Button title="Extend Timer" onPress={() => extendTimer(5)} />
          <Button title="Cancel Timer" onPress={cancelTimer} />
        </View>
      ) : (
        <Button title="Start Timer" onPress={() => startTimer(duration)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});