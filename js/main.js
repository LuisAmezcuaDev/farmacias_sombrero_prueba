// Acordeón de preguntas frecuentes (se reutiliza en cualquier página que tenga .faq-item)
document.querySelectorAll('.faq-pregunta').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('abierto');
    document.querySelectorAll('.faq-item.abierto').forEach(function(i){ i.classList.remove('abierto'); });
    if(!wasOpen){ item.classList.add('abierto'); }
  });
});

// Marca en el menú la página en la que te encuentras.
// Cada <body> lleva data-page="inicio|servicios|nosotros|sedes|ayudar|contacto"
// y cada link del menú lleva el mismo valor en data-page.
(function(){
  var paginaActual = document.body.getAttribute('data-page');
  if(!paginaActual) return;
  document.querySelectorAll('#nav-links-principal a, footer .nav-links a').forEach(function(a){
    if(a.getAttribute('data-page') === paginaActual){
      a.classList.add('activo');
    }
  });
})();

// Menú móvil (abre/cierra la lista de enlaces en pantallas angostas)
(function(){
  var boton = document.querySelector('.menu-btn');
  var enlaces = document.getElementById('nav-links-principal');
  if(!boton || !enlaces) return;
  boton.addEventListener('click', function(){
    enlaces.classList.toggle('menu-abierto');
  });
})();
