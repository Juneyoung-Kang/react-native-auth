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
	Spinner,
	Icon,
	View,
	Text,
	Left,
	Body,
	Right,
} from 'native-base';

import * as usersApi from 'ReactNativeAuth/src/data/users/api';
import * as session from 'ReactNativeAuth/src/services/session';
import * as api from 'ReactNativeAuth/src/services/api';
import FormMessage from 'ReactNativeAuth/src/components/FormMessage';

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
	input: {
		marginBottom: 20,
	},
	inputIcon: {
		width: 30,
	},
	button: {
		marginTop: 20,
		alignSelf: 'center',
	},
});

class Register extends Component {
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
			firstName: '',
			email: '',
			password: '',
		};
		this.state = this.initialState;
	}

	onPressRegister() {
		this.setState({
			isLoading: true,
			error: '',
		});
		dismissKeyboard();

		const { firstName, email, password } = this.state;
		usersApi.create({ firstName, email, password })
		.then(() => {
			session.authenticate(email, password)
			.then(() => {
				this.setState(this.initialState);
				const routeStack = this.props.navigator.getCurrentRoutes();
				this.props.navigator.jumpTo(routeStack[3]);
			});
		})
		.catch((exception) => {
			// Displays only the first error message
			const error = api.exceptionExtractError(exception);
			const newState = {
				isLoading: false,
				...(error ? { error } : {}),
			};
			this.setState(newState);
		});
	}

	onPressBack() {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
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
						<Title>회원가입</Title>
					</Body>
					<Right>
						{this.state.isLoading ? (
							<Spinner size="small" color="#000000" />
						) : (
							<Button transparent
								onPress={() => this.onPressRegister()} >
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
								<Icon style={styles.inputIcon} name="ios-arrow-forward" />
								<Input
									placeholder="이름"
									autoCorrect={false}
									onChangeText={firstName => this.setState({ firstName })}
									value={this.state.firstName}/>
							</InputGroup>
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

export default Register;
