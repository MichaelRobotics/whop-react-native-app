import type { DiscoverViewProps } from "@whop/react-native";
import ChatInterfaceWeb from "../components/ChatInterfaceWeb";

export function DiscoverView(props: DiscoverViewProps) {
	// Extract user information from props
	const userId = props.currentUserId;
	const username = props.currentUserId || 'User';

	return (
		<ChatInterfaceWeb
			userId={userId}
			username={username}
		/>
	);
}
