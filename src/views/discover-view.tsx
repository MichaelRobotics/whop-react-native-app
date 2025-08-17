import type { DiscoverViewProps } from "@whop/react-native";
import ChatInterface from "../components/ChatInterface";

export function DiscoverView(props: DiscoverViewProps) {
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
