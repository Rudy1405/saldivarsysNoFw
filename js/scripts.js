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



///TODO:  Intentar que sea tiempo real, la consulta ya esta en terminos de snapshot por ende se deberia ver el cambio tras eliminar
///       sin la neesidad de refrescar la pestana, ver porque, no hacer fix de que se refresque por medio de funcion, usar nativo para evitar costos grandes
////      Poner el save articulo en terminos de snap ara qeu se pueda ver el cambio
////      Quitar articulos dummy del HTML
////      El mensaje de que sea a guardado el articulo ponerlo de color diferente para que se note que se hizo algo. ejemplo https://www.youtube.com/watch?v=AACc80JV1sY&list=PLPl81lqbj-4JiR1Cio6xEygCZDmZmDUWI&index=14


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

            /// now we put our ref document to know where to save this shit out
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
                    OutputHeader.innerHTML = "Articulo guardado correctamente"
                    setTimeout(function() {
                        OutputHeader.innerHTML = "Agregar Articulo"
                    }, 2100);

                }).catch(function(err) {
                    console.log("Got an error: ", err)
                    OutputHeader.innerHTML = "Got an error: "
                })
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
        invRef.onSnapshot((snap) => {tabla.innerHTML='';
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
                      const buttons=document.createElement('td');
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
                    tdc3.innerHTML = value.data().subcategoria;
                    tdc4.innerHTML = value.data().marca_lab;
                    tdc5.innerHTML = value.data().descripcion;
                    tdc6.innerHTML = value.data().presentacion;
                    tdc7.innerHTML = value.data().stock;
                    tdc8.innerHTML = value.data().unidad;
                    tdc9.innerHTML = value.data().peso;
                    tdc10.innerHTML = value.data().uso;
                    tdc11.innerHTML = value.data().precio_publico;
                    tdc12.innerHTML = value.data().precio_semi;
                    tdc13.innerHTML = value.data().precio_mayoreo;
                    tdc14.innerHTML = "16%";

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


                    const editbtn = document.createElement('button');
                    const delbtn = document.createElement('button');

                    delbtn.innerHTML = "Borrar"
                    editbtn.innerHTML = "Editar"
                    delbtn.className+="deleteBtn"
                    editbtn.className+="editBtn"
                        //let aid = value.data().id_art
                    delbtn.addEventListener("click", function() {
                        //buscarDoc(aid) solo cuando no es snap
                        Page.borrarDoc(value.id)
                    })
                    editbtn.addEventListener("click", function() {
                        editarDoc(aid)
                    });

                    buttons.appendChild(editbtn);
                    buttons.appendChild(delbtn);
                    trc.appendChild(buttons);
                    tabla.appendChild(trc);
                })
            })
            .catch(function(err) {
                console.log("error", err);
            })
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

};

$(Page.init);