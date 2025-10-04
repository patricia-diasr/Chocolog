import React, { useEffect, useRef, useMemo } from "react";
import { Box, Circle } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, Easing, StyleSheet } from "react-native";
import { theme } from "../../theme";

interface FloatingParticleProps {
    size?: number;
    top: string | number;
    left: string | number;
    delay?: number;
    animationDuration?: number;
    color?: string;
}

function FloatingParticle({
    size = 8,
    top,
    left,
    delay = 0,
    animationDuration = 6000,
    color = "white",
}: FloatingParticleProps) {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0.8,
                        duration: animationDuration / 2,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: animationDuration / 2,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0.3,
                        duration: animationDuration / 2,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: animationDuration / 2,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        );

        const timer = setTimeout(() => animation.start(), delay);

        return () => {
            clearTimeout(timer);
            animation.stop();
        };
    }, [animationDuration, delay, fadeAnim, scaleAnim]);

    return (
        <Animated.View
            style={{
                position: "absolute",
                top,
                left,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
            }}
        >
            <Circle size={size} bg={color} />
        </Animated.View>
    );
}

function LoginBackground() {
    const particles = useMemo(() => {
        const particleColors = [
            "white",
            theme.colors.secondary[100],
            theme.colors.secondary[300],
            theme.colors.secondary[500],
        ];

        return Array.from({ length: 25 }, (_, i) => ({
            id: i,
            size: Math.random() * 6 + 4,
            top: `${Math.random() * 85 + 5}%`,
            left: `${Math.random() * 85 + 5}%`,
            delay: Math.random() * 2000,
            duration: Math.random() * 2000 + 3000,
            color: particleColors[
                Math.floor(Math.random() * particleColors.length)
            ],
        }));
    }, []);

    return (
        <Box style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={[
                    theme.colors.primary[700],
                    theme.colors.primary[600],
                    theme.colors.primary[500],
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {particles.map((p) => (
                <FloatingParticle
                    key={p.id}
                    size={p.size}
                    top={p.top}
                    left={p.left}
                    delay={p.delay}
                    animationDuration={p.duration}
                    color={p.color}
                />
            ))}
        </Box>
    );
}

export default React.memo(LoginBackground);
