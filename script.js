document.addEventListener('DOMContentLoaded', () => {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const canvas = document.getElementById('canvas');
    let draggedItem = null;

    // Tambahkan event listener untuk setiap elemen yang bisa diseret
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => {
                e.target.style.opacity = '0.5';
            }, 0);
        });

        item.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });

    // Tambahkan event listener untuk area drop (kanvas)
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Mencegah perilaku default browser
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const originalItem = document.getElementById(data);

        if (originalItem) {
            const newItem = document.createElement('div');
            newItem.textContent = originalItem.textContent;
            newItem.className = 'canvas-item';

            // Menentukan tipe elemen yang dijatuhkan
            switch (data) {
                case 'text-block':
                    newItem.innerHTML = '<p contenteditable="true">Klik untuk mengedit teks</p>';
                    break;
                case 'image-block':
                    newItem.innerHTML = '<img src="https://via.placeholder.com/150" alt="placeholder">';
                    break;
                case 'button-block':
                    newItem.innerHTML = '<button>Tombol</button>';
                    break;
            }
            
            // Atur posisi elemen baru
            newItem.style.position = 'absolute';
            newItem.style.left = `${e.offsetX}px`;
            newItem.style.top = `${e.offsetY}px`;

            canvas.appendChild(newItem);
        }
    });
});