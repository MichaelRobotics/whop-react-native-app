import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import config from '../config/environment';

export function DiscoverView() {
    // No props needed - this is a public marketing page
    
    const successStories = [
        {
            id: 1,
            title: "Dropshipping Success",
            description: "John built a $50K/month dropshipping business using our strategies",
            avatar: "🛍️",
            route: "dropshipping-mastery"
        },
        {
            id: 2,
            title: "Sports Betting Pro",
            description: "Sarah turned $1K into $25K with our sports analysis methods",
            avatar: "🏆",
            route: "sports-betting-elite"
        },
        {
            id: 3,
            title: "Crypto Millionaire",
            description: "Mike made his first million trading crypto with our guidance",
            avatar: "💰",
            route: "crypto-trading-pro"
        }
    ];

    const features = [
        {
            icon: "🚀",
            title: "Real-time Chat Support",
            description: "Get instant help from our expert community"
        },
        {
            icon: "📊",
            title: "Interactive Learning",
            description: "Choose your path with guided tutorials"
        },
        {
            icon: "💎",
            title: "Exclusive Strategies",
            description: "Access proven methods that actually work"
        },
        {
            icon: "🎯",
            title: "Personalized Guidance",
            description: "Get tailored advice for your goals"
        }
    ];

    const handleSuccessStoryPress = (route: string) => {
        // Link to Whop with affiliate tracking
        const affiliateUrl = `https://whop.com/discover/${route}/?app=${config.WHOP_APP_ID}`;
        console.log('🔗 Opening affiliate link:', affiliateUrl);
        // In a real implementation, you'd open this URL
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>🚀 Level Up Your Success</Text>
                    <Text style={styles.heroSubtitle}>
                        Join thousands of entrepreneurs who've transformed their lives with our proven strategies
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>10K+</Text>
                            <Text style={styles.statLabel}>Active Users</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>$2M+</Text>
                            <Text style={styles.statLabel}>Revenue Generated</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>95%</Text>
                            <Text style={styles.statLabel}>Success Rate</Text>
                        </View>
                    </View>
                </View>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ What You'll Get</Text>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <Text style={styles.featureIcon}>{feature.icon}</Text>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Success Stories Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Success Stories</Text>
                    <Text style={styles.sectionSubtitle}>
                        Real people, real results. See how our community members are crushing it:
                    </Text>
                    
                    {successStories.map((story) => (
                        <TouchableOpacity 
                            key={story.id} 
                            style={styles.successCard}
                            onPress={() => handleSuccessStoryPress(story.route)}
                        >
                            <View style={styles.successHeader}>
                                <Text style={styles.successAvatar}>{story.avatar}</Text>
                                <View style={styles.successInfo}>
                                    <Text style={styles.successTitle}>{story.title}</Text>
                                    <Text style={styles.successDescription}>{story.description}</Text>
                                </View>
                            </View>
                            <View style={styles.successFooter}>
                                <Text style={styles.successLink}>View Full Story →</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
                    <Text style={styles.ctaSubtitle}>
                        Join our community and start building your success story today
                    </Text>
                    <View style={styles.ctaButtons}>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>🚀 Get Started</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>📚 Learn More</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Join thousands of successful entrepreneurs in our community
                    </Text>
                    <Text style={styles.footerSubtext}>
                        Start your journey to financial freedom today
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 64, // Required 64px margin for iframe header
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroSection: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
        marginBottom: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    section: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
        textAlign: 'center',
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    featureCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 5,
    },
    featureDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 16,
    },
    successCard: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    successAvatar: {
        fontSize: 40,
        marginRight: 15,
    },
    successInfo: {
        flex: 1,
    },
    successTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    successDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    successFooter: {
        alignItems: 'flex-end',
    },
    successLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    ctaSection: {
        padding: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 20,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 10,
    },
    ctaSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    ctaButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginRight: 10,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 30,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '500',
    },
    footerSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});
