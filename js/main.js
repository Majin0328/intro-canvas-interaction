const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight*.8;
const window_width = window.innerWidth*.8;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y; // Inicializamos posY al valor pasado como parámetro
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = (Math.random() - 0.5) * this.speed; // Agregamos un componente aleatorio al movimiento horizontal
        this.dy = -1 * this.speed; // Cambiamos el signo para que los círculos viajen hacia arriba
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        xyMouse(ctx);

        console.log(`Coordenadas del círculo (${this.text}): X = ${this.posX}, Y = ${this.posY}`);
        this.draw(context);

        if ((this.posY - this.radius) < -this.radius) { // Cambiado a -this.radius
            // Si el círculo sale completamente de la pantalla en la parte superior, lo eliminamos
            miCirculos.splice(miCirculos.indexOf(this), 1);
            return; // Salimos de la función update para evitar cualquier otro procesamiento
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function getDistance(posX1, posY1, posX2, posY2) {
    let result = Math.sqrt(Math.pow((posX2 - posX1), 2) + Math.pow((posY2 - posY1), 2));
    return result;
}

let miCirculos = [];

for (let i = 0; i <= 10; i++) {
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius;
    let randomY = window_height + randomRadius; // Cambiado
    let randomSpeed = Math.floor(Math.random() *2)+1;

    // Comprobamos si el nuevo círculo se superpone con los círculos existentes
    let overlapping = false;
    for (let j = 0; j < miCirculos.length; j++) {
        let distance = getDistance(randomX, randomY, miCirculos[j].posX, miCirculos[j].posY);
        if (distance < randomRadius + miCirculos[j].radius) {
            overlapping = true;
            break;
        }
    }

    // Si el nuevo círculo no se superpone con ningún otro, lo agregamos
    if (!overlapping) {
        let miCirculo = new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), randomSpeed); // Cambiado el radio y la velocidad
        miCirculos.push(miCirculo);
    }
}

miCirculos.forEach(circulo => circulo.draw(ctx));

// Agregamos el evento de clic del mouse para eliminar círculos
canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Recorremos los círculos desde el último hacia el primero
    for (let i = miCirculos.length - 1; i >= 0; i--) {
        const circulo = miCirculos[i];
        const distanciaAlCentro = getDistance(mouseX, mouseY, circulo.posX, circulo.posY);

        // Verificamos si el clic del mouse está dentro del círculo
        if (distanciaAlCentro <= circulo.radius) {
            // Eliminamos el círculo de la lista
            miCirculos.splice(i, 1);
            // Limpiamos el lienzo y volvemos a dibujar los círculos restantes
            ctx.clearRect(0, 0, window_width, window_height);
            miCirculos.forEach(circulo => circulo.draw(ctx));
            // Salimos del bucle una vez que se haya eliminado un círculo
            break;
        }
    }
});

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    miCirculos.forEach(circulo => circulo.update(ctx));

    for (let i = 0; i < miCirculos.length; i++) {
        for (let j = i + 1; j < miCirculos.length; j++) {
            if (getDistance(miCirculos[i].posX, miCirculos[i].posY, miCirculos[j].posX, miCirculos[j].posY) < (miCirculos[i].radius + miCirculos[j].radius)) {
                // Cambia el color de los círculos a un color aleatorio cuando colisionan
                miCirculos[i].color = getRandomColor();
                miCirculos[j].color = getRandomColor();
                // Realiza el rebote entre los círculos cuando colisionan
                let tempDx = miCirculos[i].dx;
                let tempDy = miCirculos[i].dy;
                miCirculos[i].dx = miCirculos[j].dx;
                miCirculos[i].dy = miCirculos[j].dy;
                miCirculos[j].dx = tempDx;
                miCirculos[j].dy = tempDy;
            }
        }
    }

    miCirculos.forEach(circulo => circulo.draw(ctx));
};
function xyMouse(context) {
    context.font = "bold 15px cursive";
    context.fillStyle = "black"
    context.fillText("X: 0", 20, 10);
    context.fillText("y: 0 ", 22, 25);
}
updateCircles();
// Agregamos un evento de clic que mostrará las coordenadas del cursor
canvas.addEventListener("click", function(event) {
    // Obtenemos las coordenadas X e Y del clic en relación con el canvas
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Imprimimos las coordenadas en la consola
    console.log(`Clic en X: ${mouseX}, Y: ${mouseY}`);
});


// Función para obtener un color aleatorio en formato hexadecimal
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
