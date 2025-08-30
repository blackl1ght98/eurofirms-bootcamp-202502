/* ¿Qué hace el método reduce?

   El método `reduce` es una función de los arrays en JavaScript que permite **recorrer todos los elementos del array** y 
   combinar sus valores en uno solo (por ejemplo: una suma total, una cadena, un objeto, etc.).

   ➤ Sintaxis:

    array.reduce((acumulador, elementoActual, índice, array) => {
    // Lógica que combina elementoActual con acumulador
    return nuevoAcumulador;
    }, valorInicial);

 acumulador: El valor que se acumula en cada iteración. Empieza con valorInicial y se actualiza con lo que devuelves en cada vuelta.
 elementoActual: El elemento del array que se está procesando en la iteración actual.
 índice (opcional): La posición del elementoActual en el array.
 array (opcional): El array original que estás recorriendo.
 valorInicial: El valor inicial del acumulador. Si no lo especificas, se usa el primer elemento del array, y la iteración empieza desde el segundo.

¿Para qué sirve?
reduce es útil cuando quieres transformar un array en un solo valor, como:
Sumar números (por ejemplo, el total de un carrito).
Concatenar cadenas.
Crear un objeto o array nuevo a partir de los elementos.
Encontrar el máximo, mínimo, o cualquier cálculo acumulativo.



-----------------------------------------------------
🧪 Ejemplo simple (suma de números):
*/

const numeros = [1, 2, 3, 4];

const suma = numeros.reduce((acumulador, numero) => {
  return acumulador + numero;
}, 0);

console.log(suma); // 10

/*
🔍 ¿Qué sucede paso a paso?

1ª vuelta: acumulador = 0, número = 1  operacion -> 0 + 1 = 1 nuevo acumulador = 1
2ª vuelta: acumulador = 1, número = 2  operacion -> 1 + 2 = 3 nuevo acumulador = 3
3ª vuelta: acumulador = 3, número = 3  operacion -> 3 + 3 = 6 nuevo acumulador = 6
4ª vuelta: acumulador = 6, número = 4  operacion -> 6 + 4 = 10 nuevo acumulador =10

El resultado final es 10.
-----------------------------------------------------
🛒 Ahora, aplicado a nuestro código del carrito:
*/

cart.total = cart.products.reduce((sum, item) => sum + item.quantity * item.priceAtOrderTime, 0);

/*
📌 ¿Qué hace esto?

- `sum` inicia en 0.
- Recorre todos los productos del carrito (`cart.products`).
- Por cada producto (`item`), calcula su subtotal:
    item.quantity * item.priceAtOrderTime
- Ese subtotal se suma al acumulador (`sum`), que guarda el total acumulado.
- Al final, `reduce` devuelve el total del carrito.

📋 Ejemplo con datos:

const productos = [
  { quantity: 2, priceAtOrderTime: 10 }, // subtotal: 2 × 10 = 20
  { quantity: 1, priceAtOrderTime: 15 }, // subtotal: 1 × 15 = 15
];
1ª acumulador = 0  operacion -> 2 x 10 = 20 nuevo acumulador = 20
2ª acumulador = 20 operacion -> 1 x 15 = 15 nuevo acumulador = 15
3ª operacion -> 20 + 15 = 35


const total = productos.reduce((sum, item) => 
  sum + item.quantity * item.priceAtOrderTime, 0
);

console.log(total); // 35
*/
