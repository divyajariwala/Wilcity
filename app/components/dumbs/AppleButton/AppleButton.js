import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import PropTypes from "prop-types";
import * as AppleAuthentication from "expo-apple-authentication";

export default class AppleButton extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.object,
    onAction: PropTypes.func,
    onError: PropTypes.func
  };

  _handleLoginApple = async () => {
    const { onAction, onError } = this.props;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      onAction && onAction(credential);
      // signed in
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        onError(e.code);
      }
    }
  };
  render() {
    const { containerStyle, isLoading } = this.props;
    return (
      <View style={styles.container}>
        {!isLoading ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
            }
            style={[containerStyle, { width: "100%", height: 45 }]}
            onPress={this._handleLoginApple}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingVertical: 20,
    flex: 1
  }
});
