// Função de inicialização ou qualquer outro código adicional que você queira adicionar
document.addEventListener("DOMContentLoaded", function() {
    console.log("A página foi carregada com sucesso!");
    // Você pode adicionar mais funcionalidades aqui
});


// Função para mostrar e esconder a descrição
function toggleDescription() {
    var description = document.querySelector('.item-description');
    description.style.display = (description.style.display === 'block') ? 'none' : 'block';
}


