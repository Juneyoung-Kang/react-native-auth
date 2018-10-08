import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	TouchableWithoutFeedback,
	StyleSheet,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	InputGroup,
	Input,
	Button,
	Icon,
	Text,
	View,
	Spinner,
	Left,
	Body,
	Right,
} from 'native-base';

import FormMessage from 'ReactNativeAuth/src/components/FormMessage';
import * as session from 'ReactNativeAuth/src/services/session';
import * as api from 'ReactNativeAuth/src/services/api';

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	content: {
		padding: 30,
		flex: 1,
	},
	shadow: {
		flex: 1,
		width: null,
		height: null,
	},
	inputIcon: {
		width: 30,
	},
	input: {
		marginBottom: 20,
	},
	button: {
		marginTop: 20,
		alignSelf: 'center',
	},
	error: {
		color: 'red',
		marginBottom: 20,
	},
});

class Login extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
	}

	constructor(props) {
		super(props);

		this.initialState = {
			isLoading: false,
			error: null,
			email: '',
			password: '',
		};
		this.state = this.initialState;
	}

	onPressLogin() {
		this.setState({
			isLoading: true,
			error: '',
		});
		dismissKeyboard();

		session.authenticate(this.state.email, this.state.password)
		.then(() => {
			this.setState(this.initialState);
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[3]);
		})
		.catch((exception) => {
			// Displays only the first error message
			const error = api.exceptionExtractError(exception);
			this.setState({
				isLoading: false,
				...(error ? { error } : {}),
			});

			if (!error) {
				throw exception;
			}
		});
	}

	onPressBack() {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	renderError() {
		if (this.state.error) {
			return (
				<Text
					style={styles.error}
				>
					{this.state.error}
				</Text>
			);
		}
	}

	render() {
		return (
			<Container>
				<View style={styles.container}>
					<Header>
					<Left>
						<Button
							onPress={() => this.onPressBack()}
							transparent>
							<Icon name="ios-arrow-back" />
							<Text>Back</Text>
						</Button>
					</Left>
					<Body>
						<Title>로그인</Title>
					</Body>
					<Right>
						{this.state.isLoading ? (
							<Spinner size="small" color="#000000" />
						) : (
							<Button transparent
								onPress={() => this.onPressLogin()} >
								<Icon name="ios-arrow-forward" />
							</Button>
						)}
					</Right>
					</Header>
					<TouchableWithoutFeedback
						onPress={dismissKeyboard}>
						<View
							style={styles.content}>
							{this.state.error ? (
								<FormMessage message={this.state.error} />
							) : null}
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="ios-person" />
								<Input
									placeholder="이메일"
									keyboardType="email-address"
									autoCorrect={false}
									autoCapitalize="none"
									onChangeText={email => this.setState({ email })}
									value={this.state.email}/>
							</InputGroup>
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="ios-unlock" />
								<Input
									placeholder="패스워드"
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									secureTextEntry/>
							</InputGroup>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</Container>
		);
	}
}

export default Login;
