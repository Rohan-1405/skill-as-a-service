package com.fusion5.skillasaservice.chat_service.config;

import com.fusion5.skillasaservice.chat_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtil jwtUtil;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /ws is the WebSocket handshake endpoint. SockJS fallback for older browsers.
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // /topic = broadcast (many subscribers)
        // /queue  = user-specific (private messages, typing notifications)
        config.enableSimpleBroker("/topic", "/queue");
        // Frontend sends to /app/chat.send, /app/chat.typing, /app/user.heartbeat
        config.setApplicationDestinationPrefixes("/app");
        // /user/{userId}/queue/... for user-targeted messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Authenticate WebSocket connections using JWT passed in STOMP CONNECT headers
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            if (jwtUtil.isTokenValid(token) && !jwtUtil.isTokenExpired(token)) {
                                String uuid = jwtUtil.extractUserId(token);
                                List<String> roles = jwtUtil.extractAllClaims(token)
                                        .get("roles", List.class);
                                List<SimpleGrantedAuthority> authorities = roles == null ? List.of() :
                                        roles.stream()
                                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                                                .collect(Collectors.toList());
                                accessor.setUser(new UsernamePasswordAuthenticationToken(
                                        uuid, null, authorities));
                                log.debug("WebSocket authenticated: {}", uuid);
                            }
                        } catch (Exception e) {
                            log.warn("WebSocket JWT authentication failed: {}", e.getMessage());
                        }
                    }
                }
                return message;
            }
        });
    }
}
