async function buscarLivro(termoPesquisa) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termoPesquisa)}&key=AIzaSyDfW16aOwzD8u2X1ipqL4kzqQfOf4CWBv0`;
    const gridContainer = document.getElementById("grid-livros");
    
    gridContainer.innerHTML = "<p>Buscando livros...</p>";
    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        if (!dados.items) {
            gridContainer.innerHTML = "<p>Nenhum livro encontrado.</p>";
            return;
        }
        gridContainer.innerHTML = "";
        exibirLivros(dados.items);
    } catch (erro) {
        gridContainer.innerHTML = "<p>Erro ao carregar livros. Tente novamente.</p>";
        console.error("Erro ao buscar livros:", erro);
    }
}
function exibirLivros(livros) {
    const gridContainer = document.getElementById("grid-livros");

    livros.forEach(livro => {
        const titulo = livro.volumeInfo.title;
        const autores = livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Autor desconhecido';
        const capa = livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x193?text=Sem+Capa';
        const cardLivro = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); text-align: center;">
                <img src="${capa}" alt="Capa do livro" style="max-height: 150px; border-radius: 4px; margin-bottom: 10px;">
                <h3 style="font-size: 1rem; margin: 5px 0; color: #333; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${titulo}</h3>
                <p style="font-size: 0.85rem; color: #666; margin: 0;">${autores}</p>
            </div>
        `;
        gridContainer.innerHTML += cardLivro;
    });
}