const formulario = document.querySelector("form");
const btnNuevoPedido = document.getElementById("btnNuevoPedido");
const MENSAJE_ERROR_INPUT_INCOMPLETOS =
    "⚠️ Por favor, rellena todos los campos";
const MENSAJE_ERROR_FALTA_INGREDIENTE =
    "⚠️ Por favor, selecciona al menos 1 ingrediente";
const MENSAJE_ERROR_FALTA_TAMANO_PIZZA =
    "⚠️ Por favor, selecciona el tamaño de tu pizza";

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    // Sacamos provecho del "FormData" para recuperar todos los inputs con sus valores del formulario
    // Referencia: https://developer.mozilla.org/es/docs/Web/API/FormData
    // el objeto se forma a partir del "name" de cada input y su respectivo "value"
    const formData = new FormData(formulario);
    const datosFormulario = Object.fromEntries(formData);

    if (!esFormularioValido(datosFormulario)) {
        document.getElementById("mensajeContenedor").classList.remove("hidden");
        return;
    }

    document.getElementById("mensajeContenedor").classList.add("hidden");

    calcularTotalPedido(datosFormulario);
});

btnNuevoPedido.addEventListener("click", () => {
    formulario.reset();
    document.getElementById("pedidoRealizado").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
});

function esFormularioValido(datos) {
    // Revisamos si tenemos campos con valor de espacios en blanco (" ")
    for ([campo, valor] of Object.entries(datos)) {
        if (valor.trim() === "") {
            document.getElementById("mensajeAlerta").textContent =
                MENSAJE_ERROR_INPUT_INCOMPLETOS;
            return false;
        }
    }

    if (!existeTamanoDePizza(datos)) {
        document.getElementById("mensajeAlerta").textContent =
            MENSAJE_ERROR_FALTA_TAMANO_PIZZA;
        return false;
    }

    // Nos aseguramos que exista al menos un ingrediente
    if (!existeAlmenosUnIngrediente(datos)) {
        document.getElementById("mensajeAlerta").textContent =
            MENSAJE_ERROR_FALTA_INGREDIENTE;
        return false;
    }

    return true;
}

function existeAlmenosUnIngrediente(datos) {
    const ingredientesAVerificar = ["pepperoni", "champi", "queso", "jamon"];

    for (let ingrediente of ingredientesAVerificar) {
        // Verificamos si AL MENOS un ingrediente existe
        if (datos[ingrediente] !== undefined) return true;
    }

    return false;
}

function existeTamanoDePizza(datos) {
    return datos.pizzaSize !== undefined;
}

function calcularTotalPedido(datos) {
    let total = 0;

    const costoPorTamanoPizza = {
        pequena: 5,
        mediana: 10,
        grande: 15,
    };
    total += costoPorTamanoPizza[datos.pizzaSize];

    const ingredientes = ["pepperoni", "champi", "queso", "jamon"];
    for (let ingrediente of ingredientes) {
        if (datos[ingrediente] !== undefined) {
            total += 1;
        }
    }

    document.getElementById("totalPedido").textContent = `${total},00 €`;
    document.querySelector("main").classList.add("hidden");
    document.getElementById("pedidoRealizado").classList.remove("hidden");
}
