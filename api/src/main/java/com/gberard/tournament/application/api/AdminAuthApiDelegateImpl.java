package com.gberard.tournament.application.api;

import com.gberard.tournament.generated.api.AdminAuthApiDelegate;
import com.gberard.tournament.generated.model.AdminLoginRequest;
import com.gberard.tournament.generated.model.AdminSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthApiDelegateImpl implements AdminAuthApiDelegate {

    private final AuthenticationManager authenticationManager;

    public AdminAuthApiDelegateImpl(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public ResponseEntity<AdminSession> getAdminSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(new AdminSession(false, null));
        }

        return ResponseEntity.ok(new AdminSession(true, authentication.getName()));
    }

    @Override
    public ResponseEntity<AdminSession> loginAdmin(AdminLoginRequest adminLoginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            adminLoginRequest.getUsername(),
                            adminLoginRequest.getPassword()
                    )
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attributes.getRequest();
            HttpServletResponse response = attributes.getResponse();

            if (response == null) {
                throw new IllegalStateException("HTTP response is not available.");
            }

            new HttpSessionSecurityContextRepository().saveContext(context, request, response);

            return ResponseEntity.ok(new AdminSession(true, authentication.getName()));
        } catch (BadCredentialsException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides.");
        }
    }

    @Override
    public ResponseEntity<Void> logoutAdmin() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        SecurityContextHolder.clearContext();

        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        return ResponseEntity.noContent().build();
    }
}
