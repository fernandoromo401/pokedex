const pokeapi_url = "https://pokeapi.co/api/v2/pokemon/"
let equipo = []

// Busca pokemon en la pokeapi
const buscar = () => {
    let html = seleccionarHTML()
    const pokemon = html.valorInput.value.toLowerCase()
    if (pokemon != undefined || pokemon != null) {
        fetch(pokeapi_url + pokemon)
            .then(respuesta => respuesta.json())
            .then(data => {
                mostrarPokemon(data, html)
                agregarBoton(data, html.agregarPokemon)
            })
            .catch(() => {
                mostrarError(html, "NO SE ENCONTRO POKEMON")
            })
    }
}

// Selecciona las etiquetas html que vamos a ir cambiando
const seleccionarHTML = () => {
    return {
        valorInput: document.getElementById("input"),
        tipoPokemon: document.getElementById("tipo"),
        idPokemon: document.getElementById("numero-pokemon"),
        nombrePokemon: document.getElementById("nombre"),
        mensajeError: document.getElementById("mensaje-error"),
        imagen: document.getElementById("imagen-pokemon"),
        agregarPokemon: document.getElementById("botonera")
    }
}

// Muestra los detalles del pokemon en la pokedex
const mostrarPokemon = (data, html) => {
    html.valorInput.value = ""
    html.tipoPokemon.innerText = normalizarTipos(data.types)
    html.idPokemon.innerText = data.id
    html.nombrePokemon.innerText = (data.name).toUpperCase()
    html.imagen.setAttribute("src", data.sprites.front_default)
    html.mensajeError.innerText = ""
}

// Muestra los mensajes de error
const mostrarError = (html, error) => {
    html.valorInput.value = ""
    html.tipoPokemon.innerText = "-"
    html.idPokemon.innerText = "-"
    html.nombrePokemon.innerText = "-"
    html.imagen.setAttribute("src", "")
    html.mensajeError.innerText = error.toUpperCase()
    html.agregarPokemon ? html.agregarPokemon.style.display = "none" : false
    setTimeout(() => {
        html.mensajeError.innerText = ""
        html.imagen.setAttribute("src", `./assets/img/logo.png`)
    }, 3000);
}

// Si tiene mas de un tipo el pokemon lo formatea a un string
const normalizarTipos = tipos => {
    let tipoString = ""
    if (tipos.length > 1) {
        tipos.map(tipo => {
            tipoString += `${tipo.type.name} `
        })
        return tipoString.toUpperCase()
    }
    return tipos[0].type.name.toUpperCase()
}

// Agrega el boton para añadir pokemon al equipo
const agregarBoton = (data, botonera) => {
    let pokemon = {
        id: data.id,
        tipos: normalizarTipos(data.types),
        nombre: data.name.toUpperCase(),
        imagen: data.sprites.front_default
    }
    botonera.style.display = "flex"
    botonera.innerHTML = `<button id="" onclick='agregarEquipo(${JSON.stringify(pokemon)})' class='agregar-pokemon'>Agregar ${data.name} a equipo</button>`
}

// Agrega los pokemon al equipo y los pinta por pantalla
const agregarEquipo = pokemon => {
    if (equipo.length < 6) {
        equipo.push(pokemon)
        let contenedorEquipo = document.getElementById("pantalla-equipo")
        contenedorEquipo.innerHTML = ""
        equipo.map(pokemon => {
            contenedorEquipo.innerHTML += `<img title="${pokemon.nombre}" width="65px" src="${pokemon.imagen}">`
        })
        document.getElementById("remover-quipo").style.display = "block"
    }
    else {
        let html = seleccionarHTML()
        mostrarError(html, "ya esta el equipo completo")
    }

}

// Borra el equipo actual
const removerEquipo = () => {
    equipo = []
    document.getElementById("pantalla-equipo").innerText = ""
    document.getElementById("remover-quipo").style.display = "none"
}

// Escucha el boton enter para buscar pokemon
window.addEventListener("keyup", event => {
    if (event.isComposing || event.keyCode === 13) {
        return buscar();
    }
})