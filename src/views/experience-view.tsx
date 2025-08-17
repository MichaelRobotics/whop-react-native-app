import type { ExperienceViewProps } from "@whop/react-native";
import ChatInterface from "../components/ChatInterface";

export function ExperienceView(props: ExperienceViewProps) {
	// Extract user information from props
	const userId = props.currentUserId;
	// For now, use a friendly name since Whop only provides userId
	// In a real app, you'd fetch the username from Whop API
	const username = 'User'; // We'll make this dynamic later

	return (
		<ChatInterface
			userId={userId}
			username={username}
		/>
	);
}
