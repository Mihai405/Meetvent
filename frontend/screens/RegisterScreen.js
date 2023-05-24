import {Alert, Image, StyleSheet, Text, View} from "react-native";
import ButtonOutlined from "../components/ui/ButtonOutlined";
import TextBetweenHorizontalLines from "../components/ui/TextBetweenHorizontalLines";
import Colors from "../constants/colors";
import RegisterForm from "../components/Auth/RegisterForm";
import { useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";

const RegisterScreen = ({navigation}) => {

    function switchToLogIn() {
        navigation.replace("Login");
    }

    const [isAuthenticating, setIsAuthenticating] = useState(false);

    async function handleRegistration({username, email, password}) {
        setIsAuthenticating(true);
        const response = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            Alert.alert(
                'Authentication failed',
                'Username/Email Address already in use!'
            );
            setIsAuthenticating(false);
        } else {
            await response.json();
            navigation.replace('Login')
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Creating user..."/>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('./../assets/logo.png')}/>
            </View>
            <View>
                <RegisterForm onAuthenticate={handleRegistration}/>
            </View>
            <View style={styles.bottomContainer}>
                <TextBetweenHorizontalLines text="Already have an acount?"/>
                <View style={styles.loginButtonContainer}>
                    <ButtonOutlined onPress={switchToLogIn}>LOGIN</ButtonOutlined>
                </View>
            </View>
        </View>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        height: "100%",
        justifyContent: "space-evenly",
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginTop: 36,
        justifyContent: "center"
    },
    logo: {
        alignSelf: "center",
        width: 200,
        height: 80
    },
    bottomContainer: {
        marginBottom: 36
    },
    bottomTextContainer: {
        marginVertical: 24,
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.primary600
    },
    bottomText: {
        width: 180,
        color: Colors.primary600,
        textAlign: 'center'
    },
    loginButtonContainer: {
        width: 120,
        alignSelf: "center"
    }

})