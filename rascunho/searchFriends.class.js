class searchFriends {
    #nameSearch;

    constructor(name) {
        this.#nameSearch = name;
    }

    //método
    searchingName(){
return this.#nameSearch;
    }

}

if (!window.indexedDB) {
    window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
}
