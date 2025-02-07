package com.moneybridge.config;

import java.util.Arrays;

import com.moneybridge.security.filter.JWTCheckFilter;
import com.moneybridge.security.handler.APILoginFailHandler;
import com.moneybridge.security.handler.APILoginSuccessHandler;
import com.moneybridge.security.handler.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity// 메서드별 권한을 체크하기 위해서 해당 에너테이션이 설정되어 있어야 한다.
public class CustomSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        log.info("---------------------security config---------------------------");

        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });

        http.sessionManagement(sessionConfig ->  sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.csrf(config -> config.disable());// csrf 토큰 사용안함.
        http.formLogin(config ->{
            config.loginPage("/api/member/login");
            config.successHandler(new APILoginSuccessHandler());
            config.failureHandler(new APILoginFailHandler());
        });

        // ✅ 특정 API는 JWT 없이 접근 가능하도록 설정
        http.authorizeHttpRequests(auth ->
                auth.requestMatchers("/api/loan-products/**").permitAll() // ✅ 대출 상품 조회 API 인증 없이 접근 가능
                        .requestMatchers("/api/member/top-members/**").permitAll()  // ✅ TOP 회원 조회 API 추가
                        .requestMatchers("/api/member/check-duplicate").permitAll() // 중복 체크 API 허용
                        .requestMatchers("/api/member/login","/api/member/register").permitAll() // 로그인 API도 허용
                        .anyRequest().authenticated() // ✅ 그 외 모든 API는 인증 필요
        );

        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class); //JWT 체크

        http.exceptionHandling(config -> {config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });
        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}