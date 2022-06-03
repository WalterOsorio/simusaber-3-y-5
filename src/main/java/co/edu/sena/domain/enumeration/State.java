package co.edu.sena.domain.enumeration;

/**
 * The State enumeration.
 */
public enum State {
    Active("Activo"),
    INACTIVE("Inactivo");

    private final String value;

    State(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
