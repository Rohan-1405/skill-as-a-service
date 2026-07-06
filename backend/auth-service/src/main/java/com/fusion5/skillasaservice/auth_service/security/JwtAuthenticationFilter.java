package com.fusion5.skillasaservice.auth_service.security;

import com.fusion5.skillasaservice.auth_service.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.isTokenValid(token) && !jwtUtil.isTokenExpired(token)) {
                    String userId = jwtUtil.extractUserId(token);
                    List<String> roles = jwtUtil.extractAllClaims(token).get("roles", List.class);
                    List<String> permissions = jwtUtil.extractAllClaims(token).get("permissions", List.class);

                    List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
                    if (roles != null) {
                        roles.forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));
                    }
                    if (permissions != null) {
                        permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority("PERM_" + p)));
                    }

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(userId, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ignored) {
                // Invalid token — let the request proceed unauthenticated
            }
        }
        filterChain.doFilter(request, response);
    }
}
