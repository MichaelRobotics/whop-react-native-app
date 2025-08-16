import type { DiscoverViewProps } from "@whop/react-native";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export function DiscoverView(props: DiscoverViewProps) {
	const handleDiscover = () => {
		Alert.alert(
			"Discover Mode",
			`Hello ${props.currentUserId}! You're in discover mode.`
		);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>🔍 Discover View</Text>
				<Text style={styles.subtitle}>This is the discover page for your app</Text>
				
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>Current User ID: {props.currentUserId}</Text>
					<Text style={styles.infoText}>Path: /{props.path.join("/")}</Text>
				</View>

				<TouchableOpacity style={styles.button} onPress={handleDiscover}>
					<Text style={styles.buttonText}>🔍 Explore</Text>
				</TouchableOpacity>

				<Text style={styles.description}>
					This view is shown when users discover your app. 
					You can showcase your app's features here!
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f8ff',
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
		backgroundColor: '#4CAF50',
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
