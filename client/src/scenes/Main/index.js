import React from 'react';
import { PropTypes } from 'prop-types';
import {
	StyleSheet,
	Image,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	Text,
	Button,
	View,
	Body,
} from 'native-base';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		marginTop: 20,
		alignSelf: 'center',
	},
	contents: {
		marginTop: 100,
	},
	logo: {
		width: 100,
		height: 100,
		alignSelf: 'center'
	},
	headerContents: {
		marginTop: 200,
	},
	titleText: {
		marginTop: 30,
		alignSelf: 'center',
		color: '#3f3f3f',
		fontSize: 18,
		fontWeight: '800',
	},
});

const logoImage = require('ReactNativeAuth/src/assets/img/icon.png')

const Main = (props) => {
	const routeStack = props.navigator.getCurrentRoutes();
	return (
		<Container>
			<View style={styles.container}>
				<Header>
					<Body><Title>:D</Title></Body>
				</Header>
				<View style={styles.headerContents}>
					<Image
						source={logoImage}
						style={styles.logo}
					/>
					<Text style={styles.titleText}>교하고등학교 애플리케이션</Text>
				</View>
				<View style={styles.contents}>
					<Button info
						style={styles.button}
						onPress={() => props.navigator.jumpTo(routeStack[1])
					}>
						<Text>로그인</Text>
					</Button>
					<Button info
						style={styles.button}
						onPress={() => props.navigator.jumpTo(routeStack[2])
					}>
						<Text>회원가입</Text>
					</Button>
				</View>
			</View>
		</Container>
	);
};

Main.propTypes = {
	navigator: PropTypes.shape({
		getCurrentRoutes: PropTypes.func,
		jumpTo: PropTypes.func,
	}),
};

export default Main;
