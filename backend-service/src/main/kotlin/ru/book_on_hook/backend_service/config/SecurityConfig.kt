package ru.book_on_hook.backend_service.config

import jakarta.servlet.Filter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import ru.book_on_hook.backend_service.security.filters.JwtAuthenticationFilter
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry

//Настройка разрешенных запросов, лучше не трогать
@Configuration
@EnableWebSecurity
class SecurityConfig (

    private val jwtAuthFilter: JwtAuthenticationFilter
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val corsConfig = CorsConfiguration()
        corsConfig.setAllowedOrigins(
            mutableListOf<String?>(
                "http://localhost:3000", "http://localhost:8080", "http://nextjs:3000"
            )
        )
        corsConfig.setAllowCredentials(true)
        corsConfig.setAllowedMethods(mutableListOf<String?>("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"))
        corsConfig.setAllowedHeaders(mutableListOf<String?>("*"))

        val urlBasedConfig: UrlBasedCorsConfigurationSource = UrlBasedCorsConfigurationSource()
        urlBasedConfig.registerCorsConfiguration("/api/**", corsConfig)
        return urlBasedConfig
    }

    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors(Customizer { cors: CorsConfigurer<HttpSecurity?>? ->
                cors!!.configurationSource(
                    corsConfigurationSource()
                )
            })
            .csrf{ csrfConfigurer -> csrfConfigurer.disable() }
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { authorize ->
                authorize

                    .requestMatchers(
                        "/swagger-ui/index.html").permitAll()

                    .requestMatchers(
                        "/api/auth/signin",
                        "/api/auth/signup").permitAll()

                    .requestMatchers(
                        "/api/auth/logout",
                        "/api/my-profile",
                        "/api/orders/**").authenticated()

                    .requestMatchers(
                        "/api/admin/**",
                        "/api/books/admin/**",
                        "/api/users/admin/**",
                        "/api/orders/admin/**").hasRole("ADMIN")

                    .anyRequest().permitAll()
            }
            .addFilterBefore(jwtAuthFilter as Filter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}