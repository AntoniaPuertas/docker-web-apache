document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('test-button');
    const message = document.getElementById('message');
    
    button.addEventListener('click', function() {
        message.style.display = 'block';
        message.style.background = '#d4edda';
        message.style.color = '#155724';
        message.innerHTML = '¡JavaScript está funcionando correctamente! 🎉';
        
        // Hacer una petición AJAX de ejemplo
        fetch('index.php')
            .then(response => response.text())
            .then(data => {
                console.log('Petición AJAX exitosa');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});