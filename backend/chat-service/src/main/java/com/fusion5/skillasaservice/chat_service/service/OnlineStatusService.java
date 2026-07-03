package com.fusion5.skillasaservice.chat_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OnlineStatusService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${app.chat.online-ttl-seconds:60}")
    private long ttlSeconds;

    private String key(Long userId) { return "chat:online:" + userId; }

    /** Called on WebSocket CONNECT and heartbeat */
    public void setOnline(Long userId) {
        redisTemplate.opsForValue().set(key(userId), "1", ttlSeconds, TimeUnit.SECONDS);
    }

    /** Called on WebSocket DISCONNECT */
    public void setOffline(Long userId) {
        redisTemplate.delete(key(userId));
    }

    public boolean isOnline(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key(userId)));
    }
}
