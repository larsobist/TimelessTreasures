package com.larsobist.TimelessTreasures.security.services;

import com.larsobist.TimelessTreasures.models.User;
import com.larsobist.TimelessTreasures.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    // Implementation of the loadUserByUsername method from UserDetailsService interface
    // This method retrieves the user details by their username and returns a UserDetails object
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user in the UserRepository by their username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Create and return a UserDetailsImpl object using the User object retrieved from the repository
        return UserDetailsImpl.build(user);
    }
}
