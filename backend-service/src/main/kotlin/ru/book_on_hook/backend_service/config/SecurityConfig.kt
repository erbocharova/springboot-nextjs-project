package ru.book_on_hook.backend_service.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

//Настройка разрешенных запросов, лучше не трогать
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val corsConfig = CorsConfiguration()
        corsConfig.setAllowedOrigins(
            mutableListOf<String?>(
                "http://localhost:3000"
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
        return http.build()
    }
}