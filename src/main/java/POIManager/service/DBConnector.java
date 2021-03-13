package POIManager.service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Singleton;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileAlreadyExistsException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

@Singleton
public class DBConnector {
    public static final String DB_CONFIG_FILE = "settings.properties";
    Connection dbConnection;

    @PostConstruct
    public void connectToDB() throws IOException, SQLException {
        Properties properties = new Properties();
        InputStream propertiesInputStream = getClass().getClassLoader().getResourceAsStream(DB_CONFIG_FILE);
        if (propertiesInputStream != null) {
            properties.load(propertiesInputStream);
            String host = properties.getProperty("dbhost");
            String port = properties.getProperty("dbport");
            String name = properties.getProperty("dbname");
            String user = properties.getProperty("dbuser");
            String pass = properties.getProperty("dbpass");
            String connectionString = String.join("",
                    new String[]{
                            "jdbc:postgresql://",
                            host,
                            ":",
                            port,
                            "/",
                            name
                    }
            );
            dbConnection = DriverManager.getConnection(
                    connectionString,
                    user,
                    pass);

        } else {
            throw new FileAlreadyExistsException("No settings to DB");
        }
    }

    @PreDestroy
    public void disconnectFromDB() throws SQLException {
        if (dbConnection != null) {
            dbConnection.close();
        }
    }

    public Connection getConnection() {
        return dbConnection;
    }
}
