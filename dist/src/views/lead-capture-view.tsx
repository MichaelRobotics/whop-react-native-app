import type { ExperienceViewProps } from "@whop/react-native";
import ChatInterface from "../components/ChatInterface";

export function LeadCaptureView(props: ExperienceViewProps) {
	// Extract user information from props
	const userId = props.currentUserId;
	const username = props.currentUserId || 'User';

	return (
		<ChatInterface
			userId={userId}
			username={username}
		/>
	);
}
