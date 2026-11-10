package com.vozly.identity;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import jakarta.servlet.FilterChain;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class RateLimitFilterTests {
    @Test
    void returns429WhenEndpointLimitIsExceeded() throws Exception {
        RateLimitService service = mock(RateLimitService.class);
        when(service.allow(anyString(), anyString(), anyInt(), anyInt())).thenReturn(false);
        RateLimitFilter filter = new RateLimitFilter(service, 10, 900, 5, 3600, 30, 900, 5, 3600);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/login");
        request.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(request, response, chain);
        assertEquals(429, response.getStatus());
        assertEquals("900", response.getHeader("Retry-After"));
        verify(chain, never()).doFilter(request, response);
    }

    @Test
    void doesNotLimitUnlistedRoutes() throws Exception {
        RateLimitService service = mock(RateLimitService.class);
        RateLimitFilter filter = new RateLimitFilter(service, 10, 900, 5, 3600, 30, 900, 5, 3600);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/logout");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(request, response, chain);
        verify(service, never()).allow(anyString(), anyString(), anyInt(), anyInt());
        verify(chain).doFilter(request, response);
    }
}
