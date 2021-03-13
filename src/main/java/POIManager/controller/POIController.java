package POIManager.controller;

import POIManager.dto.POI;
import POIManager.service.POIService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;

import java.util.List;

@Controller("/poi")
public class POIController {
    private final POIService poiService;

    public POIController(POIService poiService) {
        this.poiService = poiService;
    }

    @Get
    HttpResponse<List<POI>> getPOIs() {
        return HttpResponse.ok(this.poiService.getPOIs());
    }

    @Post
    HttpResponse<POI> createPoi(POI poi) {
        POI createdPoi = this.poiService.addPoi(poi);
        if (createdPoi != null) {
            return HttpResponse.ok(createdPoi);
        } else {
            return HttpResponse.unprocessableEntity();
        }
    }
}
