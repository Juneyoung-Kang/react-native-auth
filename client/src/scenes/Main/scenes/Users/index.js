import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
	StyleSheet,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	List,
	ListItem,
	Text,
	Spinner,
	View,
	Left,
	Body,
	Right
} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as session from 'ReactNativeAuth/src/services/session';
import * as usersActionCreators from 'ReactNativeAuth/src/data/users/actions';
import * as usersSelectors from 'ReactNativeAuth/src/data/users/selectors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

const renderList = () => {
	const items = usersSelectors.getAll();
	if (items.length === 0) {
		return (
			<Spinner size="small" color="#000000" />
		);
	}

	return (
		<List>
			{items.map(item => (
				<ListItem key={item.id}>
					<Text>{item.firstName}</Text>
					<Text note>{item.email}</Text>
				</ListItem>
			))}
		</List>
	);
};

class Users extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
		actions: PropTypes.shape({
			users: PropTypes.object,
		}),
		services: PropTypes.shape({
			routeHistory: PropTypes.object,
		}),
		data: PropTypes.shape({
			users: PropTypes.object,
		}),
	}

	componentDidMount() {
		this.tryFetch();
	}

	componentDidUpdate() {
		this.tryFetch();
	}

	onPressLogout() {
		session.revoke().then(() => {
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[0]);
			this.props.actions.users.empty();
		});
	}

	tryFetch() {
		// Fetch users when the scene becomes active
		const { items } = this.props.services.routeHistory;
		if (Object.keys(this.props.data.users.items).length === 0 &&
		items.length > 0 && items[items.length - 1].name === 'Users') {
			this.props.actions.users.get();
		}
	}

	render() {
		return (
			<Container>
				<View style={styles.container}>
					<Header>
					<Left>
						<Button
							onPress={() => this.onPressLogout()}
							transparent>
							<Text> 로그아웃</Text>
						</Button>
					</Left>
					<Body>
						<Title>임시 페이지</Title>
					</Body>
					<Right>
						<Button transparent>
							<Text>Cancel</Text>
						</Button>
					</Right>
					</Header>
					<Content>
						{renderList()}
					</Content>
				</View>
			</Container>
		);
	}
}

export default connect(state => ({
	data: {
		users: state.data.users,
	},
	services: {
		routeHistory: state.services.routeHistory,
	},
}), dispatch => ({
	actions: {
		users: bindActionCreators(usersActionCreators, dispatch),
	},
}))(Users);
