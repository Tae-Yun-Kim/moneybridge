package com.moneybridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MoneybridgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoneybridgeApplication.class, args);
    }

}
