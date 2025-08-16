import type { ExperienceViewProps } from "@whop/react-native";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export function ExperienceView(props: ExperienceViewProps) {
	const handleGreet = () => {
		Alert.alert(
			"Welcome!",
			`Hello ${props.currentUserId}! Welcome to experience ${props.experienceId}`
		);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>🚀 Whop React Native App</Text>
				<Text style={styles.subtitle}>Welcome to your new React Native app!</Text>
				
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>Company ID: {props.companyId}</Text>
					<Text style={styles.infoText}>Experience ID: {props.experienceId}</Text>
					<Text style={styles.infoText}>Current User ID: {props.currentUserId}</Text>
					<Text style={styles.infoText}>Path: /{props.path.join("/")}</Text>
				</View>

				<TouchableOpacity style={styles.button} onPress={handleGreet}>
					<Text style={styles.buttonText}>👋 Greet User</Text>
				</TouchableOpacity>

				<Text style={styles.description}>
					This is a React Native app built with the Whop SDK. 
					You can customize this view to create amazing mobile experiences!
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	content: {
		padding: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 10,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginBottom: 30,
		textAlign: 'center',
	},
	infoContainer: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		marginBottom: 30,
		width: '100%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	infoText: {
		fontSize: 14,
		color: '#333',
		marginBottom: 8,
		fontFamily: 'monospace',
	},
	button: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 30,
		paddingVertical: 15,
		borderRadius: 25,
		marginBottom: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
	description: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		lineHeight: 20,
	},
});
