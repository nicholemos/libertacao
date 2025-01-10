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

// Função para mostrar e esconder as cenas nas abas
function toggleScene(sceneId) {
    var scene = document.getElementById(sceneId);
    scene.style.display = (scene.style.display === 'block') ? 'none' : 'block';
}
