// A continuacion se crea una clase base para gestionar los elementos HTML
// Posteriormente, tenemos diversas clases que heredan de la clase base (directa o indirectamente)
// El patrón de diseño utilizado es "Factory Method"
// Información adicional: https://refactoring.guru/es/design-patterns/factory-method
class ElementoHTMLBase {
    tipoDeTag;
    id;
    className;

    constructor(propiedades) {
        const { tipoDeTag, id, className } = propiedades;
        this.tipoDeTag = tipoDeTag;
        this.id = id || null;
        this.className = className || null;
    }

    construirElemento() {
        const elem = document.createElement(this.tipoDeTag);
        if (this.id !== null) {
            elem.id = this.id;
        }
        if (this.className !== null) {
            elem.className = this.className;
        }
        return elem;
    }
}

class ContenedorHTML extends ElementoHTMLBase {
    hijos;

    constructor(propiedades) {
        super(propiedades);
        this.hijos = propiedades.hijos || [];
    }

    construirElemento() {
        const elementoBase = super.construirElemento();
        this.hijos.forEach((elementoHijo) => {
            const claseElemento = obtenerClaseDelElemento(elementoHijo);
            elementoBase.appendChild(claseElemento.construirElemento());
        });
        return elementoBase;
    }
}

class TextHTML extends ElementoHTMLBase {
    texto;
    constructor(propiedades) {
        super(propiedades);
        this.texto = propiedades.texto || "";
    }

    construirElemento() {
        let elementoBase = super.construirElemento();
        elementoBase.appendChild(document.createTextNode(this.texto));
        return elementoBase;
    }
}

class InputHTML extends ElementoHTMLBase {
    name;
    label;
    value;
    tipoInput;
    constructor(propiedades) {
        super(propiedades);
        this.name = propiedades.name;
        this.label = propiedades.label || "";
        this.value = propiedades.value || "";
        this.tipoInput = propiedades.tipoInput || "";
    }

    construirElemento() {
        let elementoBase = super.construirElemento();
        elementoBase.name = this.name;
        elementoBase.value = this.value;
        return elementoBase;
    }

    construirLabel() {
        let elementoLabel = document.createElement("label");
        elementoLabel.setAttribute("for", this.id);
        elementoLabel.appendChild(document.createTextNode(this.label));
        return elementoLabel;
    }
}

class TextInputHTML extends InputHTML {
    placeholder;
    constructor(propiedades) {
        super(propiedades);
        this.placeholder = propiedades.placeholder;
    }

    construirElemento() {
        // creamos un fragmento para poder devolver mas de 1 elemento
        // en este caso devolvemos un label y input tag agrupados en uno solo
        // https://developer.mozilla.org/es/docs/Web/API/Document/createDocumentFragment
        const fragmentoDocumento = document.createDocumentFragment();
        if (this.label !== "") {
            // Si existe un label lo agregamos
            fragmentoDocumento.appendChild(this.construirLabel());
        }
        let elementoBase = super.construirElemento();
        elementoBase.placeholder = this.placeholder;
        if (this.tipoInput !== "") {
            elementoBase.type = this.tipoInput;
        }
        fragmentoDocumento.appendChild(elementoBase);
        return fragmentoDocumento;
    }
}

class TextAreaInputHTML extends TextInputHTML {
    constructor(propiedades) {
        super(propiedades);
    }

    construirElemento() {
        return super.construirElemento();
    }
}

class RadioInputHTML extends InputHTML {
    constructor(propiedades) {
        super(propiedades);
    }

    construirElemento() {
        const divElem = document.createElement("div");
        let elementoBase = super.construirElemento();
        elementoBase.type = this.tipoInput;
        divElem.appendChild(elementoBase);

        if (this.label !== "") {
            // Si existe un label lo agregamos
            divElem.appendChild(this.construirLabel());
        }

        return divElem;
    }
}

class CheckboxInputHTML extends InputHTML {
    constructor(propiedades) {
        super(propiedades);
    }

    construirElemento() {
        const divElem = document.createElement("div");
        let elementoBase = super.construirElemento();
        elementoBase.type = this.tipoInput;
        divElem.appendChild(elementoBase);

        if (this.label !== "") {
            // Si existe un label lo agregamos
            divElem.appendChild(this.construirLabel());
        }

        return divElem;
    }
}

class SelectInputHTML extends InputHTML {
    opciones;
    constructor(propiedades) {
        super(propiedades);
        this.opciones = propiedades.opciones || [];
    }

    construirElemento() {
        const divElem = document.createElement("div");
        let elementoBase = super.construirElemento();
        this.opciones.forEach((opcion) => {
            const opcionElem = document.createElement("option");
            opcionElem.value = opcion.value;
            opcionElem.text = opcion.texto;
            elementoBase.appendChild(opcionElem);
        });

        divElem.appendChild(elementoBase);

        return divElem;
    }
}

class ButtonHTML extends ElementoHTMLBase {
    texto;
    // se podria agregar mas propiedades, e.g. onClick
    constructor(propiedades) {
        super(propiedades);
        this.texto = propiedades.texto || "";
    }

    construirElemento() {
        let elementoBase = super.construirElemento();
        elementoBase.appendChild(document.createTextNode(this.texto));
        return elementoBase;
    }
}

class ImageHTML extends ElementoHTMLBase {
    src;
    width;
    height;

    constructor(propiedades) {
        super(propiedades);
        this.src = propiedades.src || "";
        this.width = propiedades.width || 200;
        this.height = propiedades.height || 200;
    }

    construirElemento() {
        let elementoBase = super.construirElemento();
        elementoBase.style.width = `${this.width}px`;
        elementoBase.style.height = `${this.height}px`;
        elementoBase.src = this.src;
        return elementoBase;
    }
}

function popularPagina() {
    // Obtenemos referencia al contenedor de la pagina
    const contenedor = document.getElementById("contenedor");

    // Se declaran los elementos a insertar en la pagina siguiendo un orden estructural
    const elementos = [
        {
            tipoDeTag: "h1",
            texto: "Formulario de Inscripción",
        },
        {
            tipoDeTag: "form",
            className: "formulario",
            hijos: [
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "DNI",
                            tipoDeTag: "input",
                            tipoInput: "text",
                            name: "DNI",
                            id: "DNI",
                            placeholder: "Ingresa tu DNI",
                            className: "form-input",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "Nombre",
                            tipoDeTag: "input",
                            tipoInput: "text",
                            name: "nombre",
                            id: "nombre",
                            placeholder: "Ingresa tu Nombre",
                            className: "form-input",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "Apellidos",
                            tipoDeTag: "input",
                            tipoInput: "text",
                            name: "apellidos",
                            id: "apellidos",
                            placeholder: "Ingresa tus Apellidos",
                            className: "form-input",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "Dirección",
                            tipoDeTag: "input",
                            tipoInput: "text",
                            name: "direccion",
                            id: "direccion",
                            placeholder: "Ingresa tu Dirección",
                            className: "form-input",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "Teléfono",
                            tipoDeTag: "input",
                            tipoInput: "text",
                            name: "telefono",
                            id: "telefono",
                            placeholder: "Ingresa tu Teléfono",
                            className: "form-input",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    className: "formulario-radio",
                    hijos: [
                        {
                            tipoDeTag: "span",
                            texto: "Selecciona tu color favorito",
                        },
                        {
                            tipoDeTag: "div",
                            hijos: [
                                {
                                    label: "Rojo",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "colorFavorito",
                                    id: "rojo",
                                    value: "rojo",
                                },
                                {
                                    label: "Verde",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "colorFavorito",
                                    id: "verde",
                                    value: "verde",
                                },
                                {
                                    label: "Azul",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "colorFavorito",
                                    id: "azul",
                                    value: "azul",
                                },
                                {
                                    label: "Amarillo",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "colorFavorito",
                                    id: "amarillo",
                                    value: "amarillo",
                                },
                            ],
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    className: "formulario-radio",
                    hijos: [
                        {
                            tipoDeTag: "span",
                            texto: "Selecciona tu color lenguaje favorito",
                        },
                        {
                            tipoDeTag: "div",
                            hijos: [
                                {
                                    label: "JavaScript",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "lenguajeFavorito",
                                    id: "js",
                                    value: "js",
                                },
                                {
                                    label: "Python",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "lenguajeFavorito",
                                    id: "python",
                                    value: "python",
                                },
                                {
                                    label: "Java",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "lenguajeFavorito",
                                    id: "java",
                                    value: "java",
                                },
                                {
                                    label: "C++",
                                    tipoDeTag: "input",
                                    tipoInput: "radio",
                                    name: "lenguajeFavorito",
                                    id: "c++",
                                    value: "c++",
                                },
                            ],
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    className: "formulario-radio",
                    hijos: [
                        {
                            tipoDeTag: "span",
                            texto: "Selecciona tus gestores de BBDD favoritas",
                        },
                        {
                            tipoDeTag: "div",
                            hijos: [
                                {
                                    label: "MySQL",
                                    tipoDeTag: "input",
                                    tipoInput: "checkbox",
                                    name: "mysql",
                                    id: "mysql",
                                    value: "mysql",
                                },
                                {
                                    label: "Postgresql",
                                    tipoDeTag: "input",
                                    tipoInput: "checkbox",
                                    name: "postgresql",
                                    id: "postgresql",
                                    value: "postgresql",
                                },
                                {
                                    label: "Oracle",
                                    tipoDeTag: "input",
                                    tipoInput: "checkbox",
                                    name: "oraclesql",
                                    id: "oraclesql",
                                    value: "oraclesql",
                                },
                                {
                                    label: "Maria DB",
                                    tipoDeTag: "input",
                                    tipoInput: "checkbox",
                                    name: "mariadb",
                                    id: "mariadb",
                                    value: "mariadb",
                                },
                            ],
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            tipoDeTag: "span",
                            texto: "Selecciona tu frontend framework",
                        },
                        {
                            tipoDeTag: "select",
                            name: "frontendFramework",
                            id: "frontendFramework",
                            opciones: [
                                {
                                    value: "react",
                                    texto: "React",
                                },
                                {
                                    value: "angular",
                                    texto: "Angular",
                                },
                                {
                                    value: "vue",
                                    texto: "Vue",
                                },
                                {
                                    value: "solidjs",
                                    texto: "SolidJS",
                                },
                            ],
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            label: "Comentarios",
                            tipoDeTag: "textarea",
                            name: "comentarios",
                            id: "comentarios",
                            placeholder: "Ingresa comentarios adicionales...",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            tipoDeTag: "img",
                            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
                        },
                    ],
                },
                {
                    tipoDeTag: "div",
                    hijos: [
                        {
                            tipoDeTag: "img",
                            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png",
                            width: 250,
                        },
                    ],
                },
            ],
        },
        {
            tipoDeTag: "div",
            className: "seccion-enviar",
            hijos: [
                {
                    tipoDeTag: "button",
                    texto: "Enviar",
                    className: "btn-enviar",
                },
            ],
        },
    ];

    // Se recorre el array de elementos declarados y se insertan al contenedor de la pagina
    elementos.forEach((elemento) => {
        const claseElemento = obtenerClaseDelElemento(elemento);
        contenedor.appendChild(claseElemento.construirElemento());
    });
}

// Factory function: https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)
// Devolveremos un nuevo objeto dinamicamente en funcion del elemento (etiqueta) recibida
function obtenerClaseDelElemento(elemento) {
    const textHTMLTags = ["h1", "h2", "h3", "h4", "h5", "p", "span"];
    const inputHTMLTags = ["input"];
    const dropdownHTMLTags = ["select"];

    const tagElemento = elemento.tipoDeTag;

    // Retornamos la clase adecuada/correspondiente en funcion del tipo de tag
    if (textHTMLTags.includes(tagElemento)) {
        return new TextHTML(elemento);
    }
    if (inputHTMLTags.includes(tagElemento)) {
        // el <input> tag puede ser de multiples tipos
        switch (elemento.tipoInput) {
            case "text":
                return new TextInputHTML(elemento);
            case "radio":
                return new RadioInputHTML(elemento);
            case "checkbox":
                return new CheckboxInputHTML(elemento);
            default:
                return new InputHTML(elemento);
        }
    }
    if (dropdownHTMLTags.includes(tagElemento)) {
        return new SelectInputHTML(elemento);
    }
    if (tagElemento === "textarea") {
        return new TextAreaInputHTML(elemento);
    }
    if (tagElemento === "button") {
        return new ButtonHTML(elemento);
    }
    if (tagElemento === "img") {
        return new ImageHTML(elemento);
    }

    // Retornamos un elemento contenedor vacio si no encaja en ningun if anterior
    // Ideal si queremos agregar etiquetas contenedoras (<div>, <section>, <main>, etc...)
    return new ContenedorHTML(elemento);
}

// Llamamos la función principal para empezar a popular la pagina mediante alteraciones del DOM
popularPagina();
