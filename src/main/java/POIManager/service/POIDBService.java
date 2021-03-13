package POIManager.service;

import POIManager.dto.POI;
import com.google.gson.Gson;
import io.micronaut.context.annotation.DefaultImplementation;

import javax.annotation.PostConstruct;
import javax.inject.Singleton;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Singleton
@DefaultImplementation
public class POIDBService implements POIService {
    Gson gson = new Gson();
    public static final String CREATE_DB_SQL = "CREATE TABLE IF NOT EXISTS public.poi (" +
            "    id serial NOT NULL PRIMARY KEY," +
            "    country varchar NOT NULL," +
            "    city varchar NOT NULL," +
            "    zipcode varchar NOT NULL," +
            "    street varchar NOT NULL," +
            "    house varchar NOT NULL," +
            "    geom geometry(Point,4326) NOT NULL" +
            ");";

    public static final String INSERT_POI_SQL = "INSERT INTO public.poi (country, city, zipcode, street, house, geom)" +
            " VALUES (?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?) ) RETURNING id;";

    public static final String SELECT_POI_SQL = "SELECT country, city, zipcode, street, house," +
            " ST_AsGeoJSON(geom) as geom FROM public.poi;";

    private final DBConnector connector;

    public POIDBService(DBConnector connector) {
        this.connector = connector;
    }

    @PostConstruct
    public void initializeDB() {
        try (Connection conn = connector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(CREATE_DB_SQL);
            ps.execute();
        } catch (SQLException ex) {
            ex.printStackTrace(System.err);
        }
    }

    @Override
    public List<POI> getPOIs() {
        List<POI> pois = new ArrayList<>();
        try (Connection conn = connector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(SELECT_POI_SQL);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                POI poi = new POI();
                poi.setCountry(rs.getString("country"));
                poi.setCity(rs.getString("city"));
                poi.setZipcode(rs.getString("zipcode"));
                poi.setStreet(rs.getString("street"));
                poi.setHouse(rs.getString("house"));
                poi.setGeom(gson.toJsonTree(rs.getString("geom")));
            }
        } catch (SQLException ex) {
            ex.printStackTrace(System.err);
        }
        return pois;
    }

    @Override
    public POI addPoi(POI poi) {
        try (Connection conn = connector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(INSERT_POI_SQL);
            ps.setString(1, poi.getCountry());
            ps.setString(2, poi.getCity());
            ps.setString(3, poi.getZipcode());
            ps.setString(4, poi.getStreet());
            ps.setString(5, poi.getHouse());
            ps.setString(6, gson.toJson(poi.getGeom()));
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                poi.setId(rs.getInt("id"));
                return poi;
            }
            return null;
        } catch (SQLException ex) {
            ex.printStackTrace(System.err);
            return null;
        }
    }
}
