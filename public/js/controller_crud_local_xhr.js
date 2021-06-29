import { createFilters, createTable, loadColumnsMenu } from "./table.js";
import { createForm } from "./form.js";
export { getInfo, postInfo, updateInfo, deleteInfo, getFilteredInfo, emptyForm, loadInitalForm, updateList, deleteNodes, calcularPromMinMax };

function getInfo() {
    //XHR
    const tableDiv = document.getElementById('tableDiv');
    const spinner = document.getElementById('spinner');
    const filters = document.getElementById('filters');
    const columns = document.getElementById('columns');
    const xhr = new XMLHttpRequest();
    let datos;
    let lastId;

    deleteNodes(tableDiv);
    deleteNodes(filters);
    deleteNodes(columns);

    if (!spinner.hasChildNodes()) spinner.appendChild(createSpinner());

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {
            while (spinner.hasChildNodes()) {
                spinner.removeChild(spinner.lastChild);
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                datos = JSON.parse(xhr.responseText);
                localStorage.setItem("anuncios", JSON.stringify(datos));
                updateList(datos);

                if (datos.length > 0) {
                    lastId = datos.reduce(function(a, b) {
                        return Math.max(a.id, b.id);
                    });
                } else {
                    lastId = 1;
                }

                return lastId;
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
                datos = [];
            }

        }

    });

    xhr.open('GET', 'http://localhost:3000/anuncios');
    xhr.send();

}

function postInfo(anuncio) {
    //XHR
    const tableDiv = document.getElementById('tableDiv');
    const spinner = document.getElementById('spinner');
    const filters = document.getElementById('filters');
    const columns = document.getElementById('columns');
    const xhr = new XMLHttpRequest();

    deleteNodes(tableDiv);
    deleteNodes(filters);
    deleteNodes(columns);

    if (!spinner.hasChildNodes()) spinner.appendChild(createSpinner());

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {

            while (spinner.hasChildNodes()) {
                spinner.removeChild(spinner.lastChild);
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                getInfo();
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
            }

        }

    });

    xhr.open('POST', 'http://localhost:3000/anuncios');
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(anuncio));

}

function updateInfo(anuncio) {
    const tableDiv = document.getElementById('tableDiv');
    const spinner = document.getElementById('spinner');
    const filters = document.getElementById('filters');
    const columns = document.getElementById('columns');
    const xhr = new XMLHttpRequest();

    deleteNodes(tableDiv);
    deleteNodes(filters);
    deleteNodes(columns);
    if (!spinner.hasChildNodes()) spinner.appendChild(createSpinner());

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {

            while (spinner.hasChildNodes()) {
                spinner.removeChild(spinner.lastChild);
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                getInfo();
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
            }

        }

    });

    xhr.open('PUT', 'http://localhost:3000/anuncios/' + anuncio.ID);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(anuncio));

}

function deleteInfo(anuncio) {
    const tableDiv = document.getElementById('tableDiv');
    const spinner = document.getElementById('spinner');
    const filters = document.getElementById('filters');
    const columns = document.getElementById('columns');
    const xhr = new XMLHttpRequest();

    deleteNodes(tableDiv);
    deleteNodes(filters);
    deleteNodes(columns);
    if (!spinner.hasChildNodes()) spinner.appendChild(createSpinner());

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {

            while (spinner.hasChildNodes()) {
                spinner.removeChild(spinner.lastChild);
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                getInfo();
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
            }

        }

    });

    xhr.open('DELETE', 'http://localhost:3000/anuncios/' + anuncio.ID);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send();

}

function updateList(list) {
    const tableDiv = document.getElementById('tableDiv');
    const filters = document.getElementById('filters');
    const columns = document.getElementById('columns');

    deleteNodes(tableDiv);
    deleteNodes(filters);
    deleteNodes(columns);

    tableDiv.appendChild(createTable(list));
    if (list.length > 0) {
        filters.appendChild(createFilters());
        columns.appendChild(loadColumnsMenu());
        calcularPromMinMax(list, 'inputAvg', '=');
        calcularPromMinMax(list, 'inputAvgP', '=p');
        calcularPromMinMax(list, 'inputMax', '+');
        calcularPromMinMax(list, 'inputMin', '-');
    }
}

function emptyForm(form) {
    form.txtTitulo.value = '';
    form.txtDescripción.value = '';
    form.transaction.value = 'Venta';
    form.txtPrecio.value = '';
    form.txtPuertas.value = '';
    form.txtKMs.value = '';
    form.txtPotencia.value = '';
}

function loadInitalForm(div) {
    while (div.firstChild) {
        div.removeChild(div.lastChild);
    }
    div.appendChild(createForm());
}

function createSpinner() {
    const img = document.createElement('img');

    img.setAttribute('src', "./spinnercar.gif");
    img.setAttribute('alt', 'Imagen Spinner');
    img.width = 100;

    return img
}

function deleteNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}


function getFilteredInfo(filter) {
    const tableDiv = document.getElementById('tableDiv');
    let datos = JSON.parse(localStorage.getItem('anuncios'));
    let filteredData = datos;

    deleteNodes(tableDiv);

    if (filter != 'Todos') {
        filteredData = datos.filter((element) => {
            return element.transaccion == filter;
        });
    } else {
        filteredData = datos;
    }

    updateList(filteredData);
    let sinFiltro = document.getElementById('optionPlaceholder');
    let filtroSeleccionado = document.getElementById('option' + filter);
    sinFiltro.selected = false;
    filtroSeleccionado.selected = true;

}

function calcularPromMinMax(datos, id, tipo) {
    let input = document.getElementById(id);

    switch (tipo) {
        case '=':
            let promedio = parseFloat(datos.reduce((prev, actual) => {
                return prev + parseFloat(actual.precio);
            }, 0.0) / datos.length);

            input.value = promedio;
            break;
        
    }
}