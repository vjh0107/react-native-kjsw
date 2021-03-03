import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Card, Text, Input, Button } from 'react-native-elements';
import firebase from 'firebase';
import * as GoogleSignIn from 'expo-google-sign-in';
import Colors from '../../constants/Colors';

class SignupScreen extends Component {
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

    createUserWithEmailAndPassword() {
        const { email, password } = this.state;
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                return res;
            })
            .catch(err => {
                //console.log(err);
                alert(err + '올바르지 않는 비밀번호 이거나 이미 가입된 이메일입니다.');
                //throw new Error(err);
            });
    }

    render() {
        return (
            <View style={styles.container}>

                <Card
                    title='계정 생성'
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
                        title="가입하기"
                        onPress={() => this.createUserWithEmailAndPassword()}
                    >
                    </Button>

                </Card>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 16, padding: 15 }}>이미 계정이 있으십니까?</Text>
                    <Button
                        icon={{
                            name: "sign-in",
                            type: 'font-awesome',
                            size: 15,
                            color: "white"
                        }}
                        buttonStyle={{ backgroundColor: Colors.primary2 }}
                        titleStyle={{ color: 'white' }}
                        loading={false}
                        raised
                        title="로그인하기"
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                    </Button>
                </View>
            </View>
        );
    }
}

export default SignupScreen;

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
