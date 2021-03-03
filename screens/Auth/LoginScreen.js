import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import { Card, Text, Input, Button } from 'react-native-elements';
import firebase from 'firebase';
import * as GoogleSignIn from 'expo-google-sign-in';
import Colors from '../../constants/Colors';
import { googleConfig } from '../../constants/firebase.config';

class LoginScreen extends Component {
    state = {
        loading: false,
        user: null,
        email: null,
        password: null
    };
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: googleConfig.client_id
        });

    }

    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        console.log(user);
        // 이제 객체를 파이어베이스에서 넘겨옴
        this.setState({ user: user });
    }

    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null });
    };

    signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                this._syncUserWithStateAsync();
            }
        } catch ({ message }) {
            alert('login: Error:' + message);
        }
    }

    onInvokeGoogleSignin = async () => {
        if (this.state.user) {
            return this.signOutAsync();
        } else {
            return this.signInAsync();
        }
    }

    signInWithGoogle() {
        this.setState({ loading: true });
        this.onInvokeGoogleSignin().finally(() => {
            this.setState({ loading: false });
        })
    }

    signInWithEmailAndPassword() {
        const { email, password } = this.state;
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                alert(err + '올바르지 않는 비밀번호 이거나 계정이 없으시다면, 회원가입 해주세요.');
            })
        // alert(`회원가입 완료 ${email}:${password}`);
    }

    render() {
        return (
            <View style={styles.container}>

                <Card
                    title='로그인'
                    containerStyle={styles.card}
                >
                    {(this.state.loading) ? <ActivityIndicator size='large' /> : null}
                    <Input
                        placeholder='이메일 주소'
                        leftIcon={
                            <Icon
                                name='envelope'
                                color='black'
                            />
                        }
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <Input
                        placeholder='비밀번호'
                        leftIcon={
                            <Icon
                                name='lock'
                                color='black'
                            />
                        }
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({ password: text })}
                    />

                    <Button
                        icon={{
                            name: "sign-in",
                            type: 'font-awesome',
                            size: 15,
                            color: "white"
                        }}
                        disabled={!(this.state.email && this.state.password)}
                        buttonStyle={{ backgroundColor: Colors.primary }}
                        loading={false}
                        raised
                        title="로그인"
                        onPress={() => this.signInWithEmailAndPassword()}
                    >
                    </Button>
                    <Text style={{textAlign:'center',fontSize:16,padding:15}}>아직 계정이 없으십니까?</Text>
                    <Button
                        icon={{
                            name: "user-plus",
                            type: 'font-awesome',
                            size: 15,
                            color: "white"
                        }}
                        buttonStyle={{ backgroundColor: Colors.primary2 }}
                        titleStyle={{color:'white'}}
                        loading={false}
                        raised
                        title="회원가입"
                        onPress={() => this.props.navigation.navigate('Signup')}
                    >
                    </Button>
                </Card>
                <Button
                    icon={{
                        name: "google-plus",
                        type: 'font-awesome',
                        size: 15,
                        color: "black"
                    }}
                    loading={false}
                    raised
                    title="구글 아이디로 로그인 합니다"
                    titleStyle={{ color: 'black' }}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.button}
                    onPress={() => this.signInWithGoogle()}
                >
                </Button>
            </View>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.primary
    },
    card: {
        width: '90%',
        paddingHorizontal: 20,
        marginHorizontal: 20,
        borderRadius: 25,
        backgroundColor: 'white'
    },
    buttonContainer: {
        top: 20
    },
    button: {
        backgroundColor: Colors.secondry,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 50,
    }
})
