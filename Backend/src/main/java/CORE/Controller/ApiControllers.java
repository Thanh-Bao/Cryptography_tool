package CORE.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiControllers {

    @GetMapping(value="/symmetric")
    public String getPage(){
    return "grjoisdgisgiosdno";
    }

    @GetMapping(value="/abc")
    public String getPage2(){
        return "grjois333333333333";
    }
}

