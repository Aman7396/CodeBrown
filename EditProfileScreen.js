import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Make sure this is correctly pointing to your Firebase config

const EditProfileScreen = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Set initial values from auth
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setOriginalEmail(user.email || "");
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      if (email !== originalEmail) {
        await updateEmail(user, email);
      }
      // Update Firestore if needed. Assume we have a users collection
      const userRef = doc(db, "MANAGERS", user.uid);
      await updateDoc(userRef, {
        displayName,
        email,
        // Add any other user fields you might want to update
      });

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.log(error);
      Alert.alert("Profile Update Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default EditProfileScreen;
