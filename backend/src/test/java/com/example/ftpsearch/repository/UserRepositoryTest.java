package com.example.ftpsearch.repository;

import com.example.ftpsearch.model.Role;
import com.example.ftpsearch.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user1, user2;

    @BeforeEach
    void setUp() {
        // 创建测试用户
        user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@example.com");
        user1.setPassword("password1");
        user1.setRole(Role.USER);
        user1.setEnabled(true);

        user2 = new User();
        user2.setUsername("admin");
        user2.setEmail("admin@example.com");
        user2.setPassword("password2");
        user2.setRole(Role.ADMIN);
        user2.setEnabled(true);

        // 保存到数据库
        userRepository.saveAll(java.util.List.of(user1, user2));
    }

    @Test
    void testFindByUsername_ExistingUser_ReturnsUser() {
        Optional<User> result = userRepository.findByUsername("user1");

        assertTrue(result.isPresent());
        assertEquals("user1@example.com", result.get().getEmail());
    }

    @Test
    void testFindByUsername_NonExistingUser_ReturnsEmpty() {
        Optional<User> result = userRepository.findByUsername("nonexistent");

        assertFalse(result.isPresent());
    }

    @Test
    void testFindByEmail_ExistingUser_ReturnsUser() {
        Optional<User> result = userRepository.findByEmail("admin@example.com");

        assertTrue(result.isPresent());
        assertEquals("admin", result.get().getUsername());
    }

    @Test
    void testFindByEmail_NonExistingEmail_ReturnsEmpty() {
        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void testExistsByUsername_ExistingUsername_ReturnsTrue() {
        boolean exists = userRepository.existsByUsername("user1");

        assertTrue(exists);
    }

    @Test
    void testExistsByUsername_NonExistingUsername_ReturnsFalse() {
        boolean exists = userRepository.existsByUsername("nonexistent");

        assertFalse(exists);
    }

    @Test
    void testExistsByEmail_ExistingEmail_ReturnsTrue() {
        boolean exists = userRepository.existsByEmail("user1@example.com");

        assertTrue(exists);
    }

    @Test
    void testExistsByEmail_NonExistingEmail_ReturnsFalse() {
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        assertFalse(exists);
    }

    @Test
    void testCountByRole_ReturnsCorrectCount() {
        long userCount = userRepository.countByRole(Role.USER);
        long adminCount = userRepository.countByRole(Role.ADMIN);

        assertEquals(1, userCount);
        assertEquals(1, adminCount);
    }

    @Test
    void testFindByRole_ReturnsCorrectUsers() {
        java.util.List<User> admins = userRepository.findByRole(Role.ADMIN);

        assertEquals(1, admins.size());
        assertEquals("admin", admins.get(0).getUsername());
    }

    @Test
    void testFindAllByEnabledTrue_ReturnsEnabledUsers() {
        java.util.List<User> enabledUsers = userRepository.findAllByEnabledTrue();

        assertEquals(2, enabledUsers.size());
    }

    @Test
    void testUpdateUserRole() {
        // 将用户1的角色更新为ADMIN
        userRepository.updateUserRole("user1", Role.ADMIN);

        Optional<User> updatedUser = userRepository.findByUsername("user1");

        assertTrue(updatedUser.isPresent());
        assertEquals(Role.ADMIN, updatedUser.get().getRole());
    }

    @Test
    void testUpdateUserStatus() {
        // 禁用用户2
        userRepository.updateUserStatus("admin", false);

        Optional<User> updatedUser = userRepository.findByUsername("admin");

        assertTrue(updatedUser.isPresent());
        assertFalse(updatedUser.get().isEnabled());
    }
}    