// Função para alternar a exibição da cena expandida
function toggleScene(sceneId) {
    const sceneContent = document.getElementById(sceneId);
    const isVisible = sceneContent.style.display === "block";
    sceneContent.style.display = isVisible ? "none" : "block";
}

// Função para mostrar a aba selecionada
function showTab(tabIndex) {
    // Remove a classe 'active' de todas as abas e botões
    const allTabs = document.querySelectorAll('.tab-pane');
    const allButtons = document.querySelectorAll('.tab-button');

    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    allButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Adiciona a classe 'active' à aba e ao botão selecionado
    document.querySelector(`#adventure${tabIndex}`).classList.add('active');
    document.querySelectorAll('.tab-button')[tabIndex - 1].classList.add('active');
}

// Inicializa a primeira aba como ativa
document.addEventListener('DOMContentLoaded', function () {
    showTab(1);  // A primeira aba é a "Aventura 1"
});
