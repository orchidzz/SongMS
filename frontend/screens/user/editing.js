import React, { useState } from "react";
import {
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import ErrorPopUp from "../../components/errors/customErrorPopup";

const EditingScreen = ({ navigation }) => {
    // edit: editing name, bio --> compare with old val
    // update: update email, pw --> no need for old val, show pop up after, return to prev page when
    // closing popup
    const route = useRoute();
    const oldVal = route.params.oldVal;
    const actionType = route.params.actionType;
    const [val, setVal] = useState(oldVal);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    var handleSave;
    switch (actionType) {
        case "updateBio":
            handleSave = async () => {
                if (oldVal !== val) {
                    navigation.navigate("ProfileScreen", {
                        val: val,
                        actionType: "updateBio",
                    });
                    return;
                }
                if (val.length > 30) {
                    setErrorVisible(true);
                    setErrorMessage(
                        "Please use a shorter bio. Limit is 30 characters."
                    );
                    return;
                }
                navigation.navigate("ProfileScreen");
            };
            break;
        case "updatePW":
            handleSave = async () => {
                if (val.length < 8) {
                    setErrorVisible(true);
                    setErrorMessage("Please use a longer password");
                    return;
                }
                navigation.navigate("ProfileScreen", {
                    val: val,
                    actionType: "updatePW",
                });
            };
            break;
        case "updateEmail":
            handleSave = async () => {
                if (val.length < 5 || !val.includes("@")) {
                    setErrorVisible(true);
                    setErrorMessage("Please use a valid email");
                    return;
                }
                navigation.navigate("ProfileScreen", {
                    val: val,
                    actionType: "updateEmail",
                });
            };
            break;
    }

    return (
        <ScrollView
            style={{
                backgroundColor: "#29323c",
                display: "flex",
                flexDirection: "column",
            }}
            contentContainerStyle={{
                alignContent: "center",
                alignItems: "center",
            }}
        >
            <LinearGradient
                colors={["#647DEE", "#7F53AC"]}
                style={styles.border}
            >
                <TextInput
                    style={styles.input}
                    placeholder={val}
                    multiline
                    onChangeText={setVal}
                    maxLength={100}
                    value={val}
                ></TextInput>
            </LinearGradient>

            <TouchableOpacity onPress={handleSave}>
                <LinearGradient
                    colors={["#647DEE", "#7F53AC"]}
                    style={styles.saveBtn}
                >
                    <Text
                        style={{
                            color: "#ffffff",
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    >
                        Save
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
            <ErrorPopUp
                message={errorMessage}
                visible={errorVisible}
                onClose={() => {
                    setErrorVisible(false);
                }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    border: {
        margin: 10,
        borderRadius: 10,
        padding: 1,
    },
    input: {
        minHeight: "10%",
        minWidth: "90%",
        maxWidth: "90%",
        backgroundColor: "white",
        margin: 3,
        borderRadius: 10,
        borderColor: "",
        padding: 10,
        fontSize: 14,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 80,
        backgroundColor: "#3f3a40",
        borderRadius: 8,
        marginTop: 5,
        paddingLeft: 12,
        paddingRight: 12,
    },
});
export default EditingScreen;
