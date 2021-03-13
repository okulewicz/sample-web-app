package POIManager.service;

import POIManager.dto.POI;

import javax.inject.Singleton;
import java.util.List;

@Singleton
public interface POIService {
    List<POI> getPOIs();

    POI addPoi(POI poi);
}
