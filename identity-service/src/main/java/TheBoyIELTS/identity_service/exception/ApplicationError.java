package TheBoyIELTS.identity_service.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationError extends RuntimeException {
    private Error error;
    ApplicationError(Error error){
      this.error = error;
    }
}
