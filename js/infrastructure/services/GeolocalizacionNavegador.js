// Obtiene la ubicación del visitante solo cuando él lo pide y la acepta.
export class GeolocalizacionNavegador {
  obtenerPosicion() {
    return new Promise((resolver, rechazar) => {
      if (!('geolocation' in navigator)) {
        rechazar(new Error('Tu navegador no permite obtener la ubicación.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => resolver({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => rechazar(new Error('No pudimos obtener tu ubicación. Elige la farmacia manualmente.')),
        { timeout: 8000, maximumAge: 60000 }
      );
    });
  }
}
