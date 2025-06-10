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
                "http://localhost:3000", "http://localhost:8080"
            )
        )
        corsConfig.setAllowCredentials(true)
        corsConfig.setAllowedMethods(mutableListOf<String?>("*"))
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

                    .requestMatchers("/swagger-ui/index.html").permitAll()
                    // Все маршруты `/api/auth/**` доступны всем
                    .requestMatchers("/api/auth/**").permitAll()

                    // Все маршруты `/api/y-profile/**` требуют авторизации
                    .requestMatchers("/api/my-profile/**", "/api/my-profile").authenticated()

                    // Все маршруты `/api/admin/**` требуют роль ADMIN
                    .requestMatchers("/api/admin/**", "/api/books/admin/**").hasRole("ADMIN")

                    .anyRequest().permitAll()
            }
            .addFilterBefore(jwtAuthFilter as Filter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}