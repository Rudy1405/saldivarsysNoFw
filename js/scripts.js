//init firebase
var config = {
    apiKey: "AIzaSyA-NWAAlpYhAfpOlfFLtzffb7FUcdYxaKk",
    authDomain: "saldivartest.firebaseapp.com",
    databaseURL: "https://saldivartest.firebaseio.com",
    projectId: "saldivartest",
    storageBucket: "saldivartest.appspot.com",
    messagingSenderId: "172196273796"
};
firebase.initializeApp(config);

/// lets create our point to firestore
var firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);


const adBtn = document.querySelector('#savedesu');
//console.log(adBtn);


//funcion bucarDoc no se usa
function buscarDoc(aid) {

    // Create a reference to the cities collection
    var invRef = firestore.collection("inventarios/inventario1/articulos");
    console.log("recibi ", aid)
        // Create a query against the collection.
    if (aid != "") {
        invRef.where("id_art", "==", aid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // console.log(doc.id, " => ", doc.data()); is never undefined for query doc snapshots
                    borrarDoc(doc.id)
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    } else {
        console.warn("id_art es vacio, no se puede procesar")
        window.alert("id es vacio, no se puede procesar")
    }

}



var Page = {

    /**
     * @type {jQuery}
     */
    $body: $('body'),

    /**
     * @type {jQuery}
     */
    $window: $(window),

    /**
     * Initialize page scripts.
     */
    init: function() {

        // Initialize page parts.
        Page.ArticleSell.init();
        // Page.dummySearch();

        Page.addModal();
        // Events
        Page.$window.on('load', function() { Page._onLoad(); });
        Page.$window.on('resize', function() { Page._onResize(); });
        Page.$window.on('scroll', function() { Page._onScroll(); });
    },


    /**
     * Fires when the page is loaded.
     * @private
     */
    _onLoad: function() {
        Page.showInventary();
    },

    /**
     * Fires when the page is resized.
     * @private
     */
    _onResize: function() {},
    /**
     * Fires on scrolling.
     * @private
     */
    _onScroll: function() {},
    /**
     * Scroll to a section indicated by hash.
     * @param {string} hash
     * @param {number} scrollTime
     * @param {number} extraOffset
     */
    // region functions
    loadAll: function() {
        loadButtonAll.addEventListener("click", function() {
            var cont = 1
            invRef.get()
                .then(function(doc) {
                    doc.forEach(function(value) {
                        const newPre = document.createElement('pre')
                        const newh2 = document.createElement('h2')
                        newh2.innerText = "Articulo" + (cont++) + " \n ------------------------- "
                        newPre.innerHTML = JSON.stringify(value.data(), null, 2)
                        newPre.id = value.data().nombre
                        pretag.appendChild(newh2)
                        pretag.appendChild(newPre)
                    })
                })
                .catch(function(err) {
                    console.log("error", err)
                })
        })
    },
    loadQuery: function() {
        loadButton6.addEventListener("click", function() {
            // console.log("Entre a la consulta")
            var cont = 1

            var fields = [{
                    value: inputtxtnom.value,
                    id: inputtxtnom.id
                },
                {
                    value: inputtxtcat.value,
                    id: inputtxtcat.id
                },
                {
                    value: inputtxtsubnom.value,
                    id: inputtxtsubnom.id
                },
                {
                    value: inputtxtsubcat.value,
                    id: inputtxtsubcat.id
                },
                {
                    value: inputtxtmarca.value,
                    id: inputtxtmarca.id
                },
                {
                    value: inputtxtuso.value,
                    id: inputtxtuso.id
                },
                {
                    value: inputtxtpresent.value,
                    id: inputtxtpresent.id
                }
            ]

            var query = invRef;
            for (let i = 0; i < fields.length; i++) {
                if (fields[i].value != "") {
                    query = query.where(fields[i].id, '==', fields[i].value)
                }
            }
            query.get()
                .then(function(doc) {
                    doc.forEach(function(value) {
                        console.log(value.data())
                        const newPre = document.createElement('pre')
                        const newh2 = document.createElement('h2')
                        newh2.innerText = "Articulo" + (cont++) + " \n ------------------------- "
                        newPre.innerHTML = JSON.stringify(value.data(), null, 2)
                        newPre.id = value.data().nombre
                        pretag.appendChild(newh2)
                        pretag.appendChild(newPre)

                    })
                })


        });
    },
    clearScreen: function() {
        cleanbut.addEventListener("click", function() {
            pretag.innerHTML = "  "
        })
    },
    saveQuery: function() {

        saveButton6.addEventListener("click", function() {
            var invDocRef = firestore.doc("inventarios/inventario1/articulos/articulo4");
            OutputHeader.innerHTML = "Guardando articulo"
                /// now we put our ref document to know where to save this shit out
            invDocRef.set({
                    nombre: inputtxtnom.value,
                    subnombre: inputtxtsubnom.value,
                    categoria: inputtxtcat.value,
                    id_art: 2,
                    subcategoria: inputtxtsubcat.value,
                    marca_lab: inputtxtmarca.value,
                    uso: inputtxtuso.value,
                    precio_publico: 40,
                    presentacion: inputtxtpresent.value,
                    stock: 100,

                }).then(function() {
                    console.log("articulo saved! :v")
                    OutputHeader.innerHTML = "articulo saved! :v"
                }).catch(function(err) {
                    console.log("Got an error: ", err)
                    OutputHeader.innerHTML = "Got an error: "
                })
                /// ready, that is going to replace my data in firesotre in my collection SAMPLES/SANDWICH DATA and if is not created is gonan to created it
                /// set returns apromise so we can use as it with then and catch
        });
    },

    searchInput: function() {
        radiocat.addEventListener("change", function() {
            invRef.get()
                .then(function(doc) {
                    doc.forEach(function(value) {
                        var data = value.data().subcategoria;
                        if (data != undefined) {
                            if (value.data().categoria === radiocat.value) {
                                const newOp = document.createElement('option')
                                newOp.innerText = data
                                newOp.id = value.data().nombre
                                newOp.value = data
                                selcat.appendChild(newOp)
                            }
                        }
                    })
                })
                .catch(function(err) {
                    console.log("error", err)
                })
        })

        clearselect.addEventListener("mouseover", function() {
            selcat.innerHTML = " "
        })
    },
    //endregion

    dummySearch: function() {

        var searchBtn = document.querySelector("#searchButton");
        var inputName = document.querySelector("#name");

        var catSelection = document.querySelector("#category");
        var subSelection = document.querySelector("#subcategory");
        var prods = document.querySelectorAll('.article');
        searchBtn.addEventListener("click", function() {
            [].forEach.call(prods, function(prod) {
                var name = prod.getAttribute('data-name');
                var cat = prod.getAttribute('data-cat');
                var sub = prod.getAttribute('data-sub');

                if (inputName.value == "" && catSelection.value == " " && subSelection.value == " ") { // ya se que este bien podia ir con el otro if pero me dio weba moverlo >:v
                    prod.classList.remove('hide');
                    prod.classList.add('show');
                } else {
                    if ((inputName.value == name && catSelection.value == " " && subSelection.value == " ") ||
                        (inputName.value == name && catSelection.value == cat && subSelection.value == sub) ||
                        (inputName.value == "" && catSelection.value == cat && subSelection.value == " ") ||
                        (inputName.value == "" && catSelection.value == " " && subSelection.value == sub) ||
                        (inputName.value == name && catSelection.value == cat && subSelection.value == " ") ||
                        (inputName.value == name && catSelection.value == " " && subSelection.value == sub) ||
                        (inputName.value == "" && catSelection.value == cat && subSelection.value == sub)) {
                        prod.classList.remove('hide');
                        prod.classList.add('show');
                    } else {

                        prod.classList.remove('show');
                        prod.classList.add('hide');
                    }
                }
            });

        });


    },

    addModal: function() {

        var addBtn = document.querySelector(".add-btn");
        addBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            let settings = {
                avoidClose: false,
                closeWithOverlay: true,
                effectName: 'pl-effect-2'
            };
            Page.$modalAdd = new pl.Modal(settings);

            var content = document.querySelector('.modal-agregar');
            var target = content.cloneNode(true);

            Page.$modalAdd.opened.add(() => {
                Page.newItem(target, Page.$modalAdd);


            });

            Page.$modalAdd.open(target);

        });
    },

    newItem: function(target, modal) {
        var addbtn = target.querySelector("#savedesu");
        var cancelbtn = target.querySelector("#canceldesu");
        const OutputHeader = target.querySelector("#tituloAgregado")
        const inputtxtnom = target.querySelector("#nombre")
        const inputtxtsubnom = target.querySelector("#subnombre")
        const inputtxtcat = target.querySelector("#categoria")
        const inputtxtsubcat = target.querySelector("#subcategoria")
        const inputtxtmarca = target.querySelector("#marca_lab")
        const inputtxtuso = target.querySelector("#uso")
        const inputtxtpresent = target.querySelector("#pres")
        const inputtxtdesc = target.querySelector("#descripcion")
        const inputtxtcant = target.querySelector("#cant")
        const inputtxtunidad = target.querySelector("#unidad")
        const inputtxtpeso = target.querySelector("#peso")
        const inputtxtprecio = target.querySelector("#precio")
        const inputtxtsemi = target.querySelector("#semi")
        const inputtxtmayoreo = target.querySelector("#mayoreo")
        const inputtxtiva = target.querySelector("#iva")
        const inputtxtart = target.querySelector("#idart")


        addbtn.addEventListener("click", function() {
            var invDocRef = firestore.collection("inventarios/inventario1/articulos/");
            var els = target.getElementsByClassName("features");
            var band = true;
            var cont = 0;
            // Or
            [].forEach.call(els, function(el) {

                if (el.name == "idart") {
                    if (el.value.length < 3) {
                        OutputHeader.style.color = "red"
                        OutputHeader.style.fontSize = "20px"
                        OutputHeader.innerHTML = "El Id Debe tener al menos 4 numeros"
                        band = false;
                    }
                }
                if (el.name == "nombre") {
                    if (el.value == "") {
                        OutputHeader.style.color = "red"
                        OutputHeader.style.fontSize = "20px"
                        OutputHeader.innerHTML = "Por favor ingresa un nombre de articulo";
                        console.log("vacio");
                        band = false;
                    }
                }

                if (el.value == "") {
                    cont++;
                }

            });
            if (cont >= els.length) {
                OutputHeader.style.color = "red"
                OutputHeader.style.fontSize = "20px"
                OutputHeader.innerHTML = "Error: Articulo vacío";
                band = false;
            }
            /// now we put our ref document to know where to save this shit out
            if (band) {
                invDocRef.add({
                    nombre: inputtxtnom.value,
                    subnombre: inputtxtsubnom.value,
                    categoria: inputtxtcat.value,
                    id_art: inputtxtart.value,
                    subcategoria: inputtxtsubcat.value,
                    marca_lab: inputtxtmarca.value,
                    uso: inputtxtuso.value,
                    presentacion: inputtxtpresent.value,
                    stock: inputtxtcant.value,
                    descripcion: inputtxtdesc.value,
                    unidad: inputtxtunidad.value,
                    peso: inputtxtpeso.value,
                    precio_publico: inputtxtprecio.value,
                    precio_mayoreo: inputtxtmayoreo.value,
                    precio_semi: inputtxtsemi.value,
                    iva: inputtxtiva.value


                }).then(function() {
                    console.log("articulo saved!")
                    console.log(OutputHeader);
                    OutputHeader.style.fontSize = "20px"
                    OutputHeader.style.color = "red"
                    OutputHeader.innerHTML = "Articulo guardado correctamente"
                    var elems = target.getElementsByClassName("features");
                    [].forEach.call(elems, function(el) {
                        el.value = "";

                    });

                    setTimeout(function() {
                        OutputHeader.style.color = "black"
                        OutputHeader.innerHTML = "Agregar Articulo"
                            //Page.limpiaAgregar()
                    }, 2100);

                }).catch(function(err) {
                    console.log("Got an error: ", err)
                    OutputHeader.innerHTML = "Got an error: "
                })
            }

            /// ready, that is going to replace my data in firesotre in my collection SAMPLES/SANDWICH DATA and if is not created is gonan to created it
            /// set returns apromise so we can use as it with then and catch
        });
        cancelbtn.addEventListener('click', function() {

            modal.close();
        });
    },
    showInventary: function() {
        var tabla = document.getElementById("tableishon");


        var invRef = firestore.collection("inventarios/inventario1/articulos");
        var cont = 1;
        invRef.onSnapshot((snap) => {
            tabla.innerHTML = '';
            snap.forEach((value) => {
                const trc = document.createElement('tr');
                const thc = document.createElement('th');
                const tdc1 = document.createElement('td');
                const tdc2 = document.createElement('td');
                const tdc3 = document.createElement('td');
                const tdc4 = document.createElement('td');
                const tdc5 = document.createElement('td');
                const tdc6 = document.createElement('td');
                const tdc7 = document.createElement('td');
                const tdc8 = document.createElement('td');
                const tdc9 = document.createElement('td');
                const tdc10 = document.createElement('td');
                const tdc11 = document.createElement('td');
                const tdc12 = document.createElement('td');
                const tdc13 = document.createElement('td');
                const tdc14 = document.createElement('td');
                const buttons = document.createElement('td');
                buttons.style.display = "flex";

                /*           tabla.innerHTML+=`<tr>
                                      <th scope="row">${value.data().id_art}<th>
                                      <td contenteditable="true">${value.data().nombre}</td>
                                      <td contenteditable="true">${value.data().categoria}</td>
                                      <td contenteditable="true">${value.data().subcategoria}</td>
                                      <td contenteditable="true">${value.data().marca_lab}</td>
                                      <td contenteditable="true">${value.data().descripcion}</td>
                                      <td contenteditable="true">${value.data().presentacion}</td>
                                      <td contenteditable="true">${value.data().stock}</td>
                                      <td contenteditable="true">${value.data().unidad}</td>
                                      <td contenteditable="true">${value.data().peso}</td>
                                      <td contenteditable="true">${value.data().uso}</td>
                                      <td contenteditable="true">${value.data().precio_publico}</td>
                                      <td contenteditable="true">${value.data().precio_semi}</td>
                                      <td contenteditable="true">${value.data().precio_mayoreo}</td>
                                      <td contenteditable="true">${value.data().iva}</td>
                                      <td><button class="editBtn">Editar</button><button class="deleteBtn">Borrar</button></td>
                                      </tr>              
`*/

                thc.innerHTML = value.data().id_art;
                tdc1.innerHTML = value.data().nombre;

                tdc2.innerHTML = value.data().categoria;
                if (value.data().categoria == 'undefined')
                    tdc2.innerHTML = "";
                tdc3.innerHTML = value.data().subcategoria;
                if (value.data().subcategoria == 'undefined')
                    tdc3.innerHTML = "";

                tdc4.innerHTML = value.data().marca_lab;
                if (value.data().marca_lab == 'undefined')
                    tdc4.innerHTML = "";
                tdc5.innerHTML = value.data().descripcion;
                if (value.data().descripcion == 'undefined')
                    tdc5.innerHTML = "";

                if (value.data().categoria == 'undefined')
                    tdc2.innerHTML = "";

                tdc6.innerHTML = value.data().presentacion;

                tdc7.innerHTML = value.data().stock;
                tdc7.id = "stock_" + value.data().id_art;
                tdc7.contentEditable = "true";
                tdc7.style.color = "#28a745"

                tdc8.innerHTML = value.data().unidad;

                tdc9.innerHTML = value.data().peso;

                tdc10.innerHTML = value.data().uso;

                tdc11.innerHTML = value.data().precio_publico;
                tdc11.id = "precioP_" + value.data().id_art;
                tdc11.contentEditable = "true";
                tdc11.style.color = "#28a745"

                tdc12.innerHTML = value.data().precio_semi;
                tdc12.id = "precioS_" + value.data().id_art;
                tdc12.contentEditable = "true";
                tdc12.style.color = "#28a745"

                tdc13.innerHTML = value.data().precio_mayoreo;
                tdc13.id = "precioM_" + value.data().id_art;
                tdc13.contentEditable = "true";
                tdc13.style.color = "#28a745"

                tdc14.innerHTML = value.data().iva;

                trc.appendChild(thc);
                trc.appendChild(tdc1);
                trc.appendChild(tdc2);
                trc.appendChild(tdc3);
                trc.appendChild(tdc4);
                trc.appendChild(tdc5);
                trc.appendChild(tdc6);
                trc.appendChild(tdc7);
                trc.appendChild(tdc8);
                trc.appendChild(tdc9);
                trc.appendChild(tdc10);
                trc.appendChild(tdc11);
                trc.appendChild(tdc12);
                trc.appendChild(tdc13);
                trc.appendChild(tdc14);
                trc.id = "row_" + value.data().id_art;

                const editbtn = document.createElement('button');
                const delbtn = document.createElement('button');

                delbtn.innerHTML = "Borrar"
                editbtn.innerHTML = "Editar"
                delbtn.className += "deleteBtn"
                editbtn.className += "editBtn"
                    //let aid = value.data().id_art
                delbtn.addEventListener("click", function() {
                    //buscarDoc(aid) solo cuando no es snap
                    Page.borrarDoc(value.id)
                })
                editbtn.addEventListener("click", function() {
                    Page.editarDoc(value.id, tdc7.id, tdc11.id, tdc12.id, tdc13.id, trc.id)
                });

                buttons.appendChild(editbtn);
                buttons.appendChild(delbtn);
                trc.appendChild(buttons);
                tabla.appendChild(trc);
            })
        })
    },

    editarDoc: function(idDocumento, idTd1, idTd2, idTd3, idTd4, idFila) {
        /// se obtiene la referencia de que articulo vamos a actualizar 
        var articuloRef = firestore.collection("inventarios/inventario1/articulos").doc(idDocumento);
        //obtenemos los ID de las cols de la tabla que tiene los elementos editables

        const stockCol = document.getElementById(idTd1)
        const ppCol = document.getElementById(idTd2)
        const psCol = document.getElementById(idTd3)
        const pmCol = document.getElementById(idTd4)


        // Set los valores qeu contienen los tags en ese momento ahora en la bd
        return articuloRef.update({
                stock: stockCol.innerHTML,
                precio_publico: ppCol.innerHTML,
                precio_mayoreo: pmCol.innerHTML,
                precio_semi: psCol.innerHTML
            })
            .then(function() {
                console.log("Document successfully updated! ", idFila)
                    //row.style.backgroundColor = "#26a60066"
                const rowland = document.getElementById(idFila)
                rowland.style.backgroundColor = "#26a60066"
                setTimeout(function() {
                    rowland.style.backgroundColor = ""
                }, 800);

            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    },

    borrarDoc: function(idDocumento) {
        var invRef = firestore.collection("inventarios/inventario1/articulos");
        invRef.doc(idDocumento).delete().then(function() {
            console.log("Document successfully deleted!");
            //window.alert("Se ha eliminado el articulo, recarga para visualizar")

        }).catch(function(error) {
            console.error("Error removing document: ", error);
            window.alert("No se ha podido borrar el elemento ERROR!")
        });

    },

    limpiaAgregar: function(target, modal) {

        const elm1 = target.querySelector("#idart")
        const elm2 = target.querySelector("#nombre")
        const elm3 = target.querySelector("#subnombre")
        const elm4 = target.querySelector("#categoria")
        const elm5 = target.querySelector("#pres")
        const elm6 = target.querySelector("#subcategoria")
        const elm7 = target.querySelector("#cant")
        const elm8 = target.querySelector("#unidad")
        const elm9 = target.querySelector("#peso")
        const elm10 = target.querySelector("#uso")
        const elm11 = target.querySelector("#marca_lab")
        const elm12 = target.querySelector("#descripcion")
        const elm13 = target.querySelector("#precio")
        const elm14 = target.querySelector("#semi")
        const elm15 = target.querySelector("#mayoreo")
        const elm16 = target.querySelector("#iva")

        elm1.innerHTML = ""
        elm2.innerHTML = ""
        elm3.innerHTML = ""
        elm4.innerHTML = ""
        elm5.innerHTML = ""
        elm6.innerHTML = ""
        elm7.innerHTML = ""
        elm8.innerHTML = ""
        elm9.innerHTML = ""
        elm10.innerHTML = ""
        elm11.innerHTML = ""
        elm12.innerHTML = ""
        elm13.innerHTML = ""
        elm14.innerHTML = ""
        elm15.innerHTML = ""
        elm16.innerHTML = ""

    },

    ArticleSell: {
        items: null,
        item: null,
        itemPrice: null,
        totalPrice: null,
        init: function() {
            var self = this;

            var $unidad = $('.s-unidad');
            var $unidades = $('.s-unidad .s-unit ');
            $unidad.on('click', function() {
                var total = 0;
                this.items = $('.selling .articles');
                this.item = this.items.find('.item');
                $(this.item).each(function() {
                    this.price = $(this).find('.price');
                    this.unidad = $(this).find('.s-unit:selected');
                    var $price = this.price.attr('data-value');
                    var unit = this.unidad.val();
                    var partial = parseFloat($price);

                    partial = partial * unit;
                    total = total + partial;

                    this.totalPrice = $('.payment .total .prod-price');
                    console.log(this.totalPrice);
                    this.totalPrice.text("$" + total + ".00");
                });

            });
        }
    }
    /**
     * Contact
     */


};

$(Page.init);