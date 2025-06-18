package com.augusto.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class MySQLConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testMySQLConnection() throws Exception {
        assertNotNull(dataSource);
        
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection);
            
            DatabaseMetaData metaData = connection.getMetaData();
            String databaseProductName = metaData.getDatabaseProductName();
            
            assertEquals("MySQL", databaseProductName);
            System.out.println("✅ Conectado ao MySQL com sucesso!");
            System.out.println("Database: " + databaseProductName);
            System.out.println("URL: " + metaData.getURL());
            System.out.println("Driver: " + metaData.getDriverName());
        }
    }
} 