package ru.book_on_hook.backend_service.security

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import ru.book_on_hook.backend_service.dao.User

class CustomUserDetails(
    private val username: String,
    private val passwordHash: String,
    private val firstName: String,
    private val lastName: String,
    private val birthDate: String,
    private val authorities: Collection<GrantedAuthority>,
    private val enabled: Boolean = true
) : UserDetails {

    constructor(user: User) : this(
        username = user.username,
        passwordHash = user.passwordHash,
        firstName = user.firstName,
        lastName = user.lastName,
        birthDate = user.birthDate,
        authorities = listOf(SimpleGrantedAuthority(user.role.name)),
        enabled = true
    )

    override fun getAuthorities(): Collection<GrantedAuthority> = authorities
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = enabled
    override fun getPassword(): String = passwordHash
    override fun getUsername(): String = username

    fun getFirstName(): String = firstName
    fun getLastName(): String = lastName
    fun getBirthDate(): String = birthDate
}