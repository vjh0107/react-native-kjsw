import React from 'react';
import { View, StyleSheet} from 'react-native';
import { Avatar, Divider, Banner, Button, Card, TextInput, Paragraph } from 'react-native-paper';
import firebase from 'firebase';

const ProfileScreen = () => {
  const [user, setUserProfile] = React.useState(firebase.auth().currentUser);
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(firebase.auth().currentUser.displayName);
  const LeftContent = props => <Avatar.Icon {...props} icon="account-edit" />
  const updateProfile = () => {
    setLoading(true);
    user.updateProfile({
      displayName: displayName,
      photoURL: "https://api.adorable.io/avatars/285/" + displayName + '.png'
    }).then(() => {
      alert('Profile Updated!!');
    }).catch((error) => {
      alert(error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const sendVerificationEmail = () => {
    setSending(true);
    user.sendEmailVerification().then(res => {
      alert('Email sent to ' + user.email);
    }).catch(err => {
      alert(err);
    })
      .finally(() => {
        setSending(false);
      })
  };

  let verifyEmailButton = (
    <Banner
      visible={!user.emailVerified}
      actions={[
        {
          label: '이메일 인증 보내기',
          onPress: () => sendVerificationEmail(),
          loading: sending
        },
      ]}
    >
      이메일 인증이 되지 않았습니다. 이메일을 통해 이메일 인증을 진행해주시고, 다시 로그인해주세요.
    </Banner>
  );

  return (
    <View style={styles.container}>
      <Card style={{ width: '100%' }}>

        <Card.Title title={displayName} subtitle={user.email} left={LeftContent} />
        <Card.Content>
          <TextInput
            label='Display Name'
            mode='outlined'
            value={displayName}
            onChangeText={text => setDisplayName(text)}
          />
        </Card.Content>
        <Divider/>
        {verifyEmailButton}
      </Card>
      <View>
        <Button
          onPress={() => updateProfile()}
          style={{ bottom: 15 }}
          icon="account-edit" mode="outlined" uppercase={false}
          loading={loading}
        >
          Update My Profile
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
